# todo time zone simpliciation
import logging
from typing import Union

import kioskrepllib
import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from filehandlingsets import get_file_handling_set
from kiosksqldb import KioskSQLDb
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from statemachine import StateMachine
from sync_config import SyncConfig
from tz.kiosktimezoneinstance import KioskTimeZoneInstance


class Dock:
    """
        Abstract class referencing a workstation, which is basically a machine registered to host a copy
        of the database. That can be a database copy partaking in synchronization or a database copy representing
        a remote server.

    .. note:
        Class defines basic behaviour and the general interface for workstation classes
        but is not supposed to be instantiated itself.

        debug_mode can be used to test different behaviours during test and developtment.
        Should always be "" in the end.
    """

    debug_mode = ""
    STATE_NAME = {}

    def __init__(self, workstation_id, description="", sync=None, *args, **kwargs):
        """
            constructor needs a workstation id, no matter if the workstation exists or
            is going to be created. If the workstation exists in the database, the
            constructor initializes the object with the database data.

            **kwargs are translated into __dict__ - key/value pairs of the instance
                if and only if the workstation did not already exist. This is why deriving
                classes should always call the super() - constructor rather at the end of the __init__ method.

        """
        self.register_states()
        self._id = kioskstdlib.delete_any_of(workstation_id, " *%\"'")
        self.description = description
        self._exists = False
        self.event_buffer = []
        self.state_machine = StateMachine()
        self.callback_progress = None
        self.init_state_machine()
        self._db_namespace = workstation_id.lower()
        self._sync = sync
        self.recording_group = ""
        self._user_time_zone_index = None
        self._recording_time_zone_index = None
        self.grant_access_to = ""
        self.current_tz: Union[KioskTimeZoneInstance, None] = None

        try:
            self._exists = self._load()
            if not self._exists:
                for arg in kwargs:
                    self.__dict__[arg] = kwargs[arg]
        except Exception as e:
            logging.error(repr(e))
            raise Exception(f'Instantiation of Workstation {workstation_id} failed: {repr(e)}')

    @property
    def user_time_zone_index(self) -> Union[int, None]:
        """
        The user time zone index stored for this workstation.
        Note that this is not necessarily the one to use in an operation

        :return: int | None
        """
        return self._user_time_zone_index

    @user_time_zone_index.setter
    def user_time_zone_index(self, value):
        self.set_user_time_zone_index(value)

    def set_user_time_zone_index(self, tz_index: int):
        self._user_time_zone_index = tz_index

    @property
    def recording_time_zone_index(self) -> Union[int, None]:
        """
        The recording time zone index stored for this workstation.
        Note that this is not necessarily the one to use in an operation

        :return: int | None
        """
        return self._recording_time_zone_index

    def set_recording_time_zone_index(self, tz_index: int):
        self._recording_time_zone_index = tz_index

    @classmethod
    def get_workstation_type(cls) -> str:
        """ Must be overridden by subclasses and return a proper dock / workstation type """
        raise NotImplementedError

    def get_config_value(self, key, default_value="") -> str:
        """
        just returns a value for the configuration key. The keys are supposed to be in
        the config section that is named after this class: FileExportWorkstation.
        :returns: either the value for the key or ""
        """
        cfg = SyncConfig.get_config()
        return kioskstdlib.try_get_dict_entry(cfg[self.__class__.__name__.lower()], key, default_value)

    @classmethod
    def register_states(cls):
        """ populates the class list "STATE_NAME" with numeric keys and the states they refer to.
            add / modify only states used by your class, always call the super first.
        example:
        STATE_NAME.update({
                      0: cls.IDLE,
                      1: cls.READY_FOR_EXPORT
                      })
        """
        cls.STATE_NAME = {-1: "UNDEFINED"}

    def init_state_machine(self):
        """ Initializes the internal state machine with available states.
            This has no returns and takes no parameters but can possibly throw
            exceptions.

            needs to be overridden by subclasses. But they need to call super first.
        """
        for state_nr, state_name in self.STATE_NAME.items():
            if state_nr > -1:
                self.state_machine.add_state(state_name)

    def get_state_from_code(self, state_code):
        """
        returns the state name for the state_machine that corresponds with a numeric code in the database.
        Needs to be overwritten by deriving classes that control additional states.

        :param state_code: the numeric code that represents a state in the database
        :return: the name of the state as the state_machine wants it

        """
        if state_code in self.STATE_NAME:
            return self.STATE_NAME[state_code]
        else:
            return None

    def get_code_from_state(self, param_state):
        """
        returns the numeric code that corresponds with a state name as the state machine knows it.
        Needs to be overwritten by deriving classes that control additional states.

        :param param_state: the name of the state as the state_machine wants it
        :return: the numeric code that represents a state in the database

        """
        param_state = param_state.upper()
        for numcode, state in self.STATE_NAME.items():
            if state == param_state:
                return numcode

        return -1

    def exists(self):
        """
            checks whether this instance of a workstation refers to a persistent workstation or whether
            it is in a not yet persisted state.
        """
        return self._exists

    # def set_synchronization_instance(self, sync):
    #     self._sync = sync

    def isvalid(self):
        """
            checks whether all information is given to this workstation in order to create it
        """
        return bool(self.description) and bool(self._id)

    def _on_load(self):
        """ after the basic workstation data has been loaded successfully this is called.
            Should be overridden by subclasses if they have to load more """
        pass

    def _load(self, cur=None):
        """ initializes the object's properties from the database
            do not override this method but rather _on_load

        ..  note:

            Does not catch exceptions. returns false if no record could be found
            under the current id.

        """

        if not cur:
            cur = KioskSQLDb.get_cursor()

        if cur:
            try:
                cur.execute(
                    f'select ' + f'description, state, recording_group, user_time_zone_index,'
                                 f'grant_access_to, recording_time_zone_index from "repl_workstation" '
                                 f'where id=%s;',
                    [self._id])
                r = cur.fetchone()
                if r is not None:
                    self.description = r[0]
                    self.recording_group = r[2]
                    self._user_time_zone_index = r[3]
                    self.grant_access_to = r[4] if r[4] else "*"
                    self._recording_time_zone_index = r[5]
                    state = self.get_state_from_code(r[1])
                    self.state_machine.set_initial_state(state)
                    cur.close()
                    self._on_load()
                    return True
                else:
                    cur.close()
                    return False
            except Exception as e:
                try:
                    cur.close()
                finally:
                    raise e
        else:
            raise Exception("Could not look up workstation " + self._id + " in database - no cursor")

    def save(self):
        """
            Saves a workstation if it is valid.
            commits the current db session.
            Returns True/False
        """
        if not self.isvalid():
            return False

        if not self._exists:
            rc = self._create()
            if rc:
                kioskrepllib.log_repl_event("dock create", "CREATED", self._id, commit=True)
        else:
            rc = self._update()
            if rc:
                kioskrepllib.log_repl_event("dock settings", "SETTINGS CHANGED", self._id, commit=True)
        return rc

    def _on_create_workstation(self, cur):
        """
        Deriving classes may add something to the creation process.

        :param cur: an open cursor embedded in a transaction. This here will not commit!
        :exception: can throw all kinds of exceptions. Has no return value.
        """
        pass

    def _get_workstation_dsd(self) -> DataSetDefinition:
        """
        returns a view on the master dsd for this workstation
        :return: a DataSetDefinition
        """
        raise NotImplementedError()

    def create_dsd_tables(self):
        """
            create workstation's tables from the dsd
        """
        workstation_dsd = self._get_workstation_dsd()
        self.migrate_workstation_tables(workstation_dsd)

    def migrate_workstation_tables(self, dsd: DataSetDefinition):
        """
        Migrates the workstation's tables to their current version.
        The results are not automatically committed
        (except if the connection is an auto commit connection, of course.)

        :param dsd: the DataSetDefinition
        :returns: Nothing. Throws Exception if it fails.
        :exception: Exception in case of failure.
        """
        migration = Migration(dsd=dsd,
                              db_adapter=PostgresDbMigration(dsd=dsd,
                                                             psycopg2_con=KioskSQLDb.get_con()),
                              project_id=SyncConfig.get_config().get_project_id())
        if not migration.migrate_dataset(prefix=self._id + "_", namespace=self._db_namespace.lower()):
            logging.error(f"{self.__class__.__name__}.migrate_workstation_tables: "
                          f"migration failed for workstation {self._id} ")
            raise Exception(f"migration failed for workstation {self._id} ")

    def _create(self):
        """creates a RecordingWorkstation in the database under the current ID.

        .. note::
            subclasses should not override _create but _on_create_workstation instead.

            does not check if the current ID already exists in the database.
            returns False if the operation failed, which could be due to
            an attempt to create a duplicate id in the database.

        """

        cfg = SyncConfig.get_config()

        if not self.recording_group:
            self.recording_group = cfg.default_recording_group

        if not get_file_handling_set(self.recording_group, cfg):
            logging.error(f"{self.__class__.__name__}._create: Cannot create RecordingWorkstation "
                          f"because there is no file handling set defined"
                          f" for recording group {self.recording_group}")
            return False

        try:
            self.create_dsd_tables()
            cur = KioskSQLDb.get_cursor()
            if cur is not None:
                self._on_create_workstation(cur)

                cur.execute("DELETE " + "FROM \"repl_workstation\" where \"id\" = %s", [self._id])
                sql = "INSERT " + ("INTO \"repl_workstation\"(\"id\",\"description\",\"recording_group\", \"state\", "
                                   "\"workstation_type\", \"user_time_zone_index\", \"grant_access_to\", "
                                   "\"recording_time_zone_index\") "
                                   "VALUES(%s, %s, %s, %s, %s, %s, %s, %s)")

                cur.execute(sql, [self._id,
                                  self.description,
                                  self.recording_group,
                                  self.get_code_from_state("IDLE"),
                                  self.get_workstation_type(),
                                  self._user_time_zone_index,
                                  self.grant_access_to,
                                  self.recording_time_zone_index])
                KioskSQLDb.commit()
                self.state_machine.set_initial_state("IDLE")

                self._exists = True

                return True
            else:
                logging.error('No Model cursor in Workstation._create')

        except Exception as e:
            logging.error("Exception in Workstation._create: " + repr(e))
            KioskSQLDb.rollback()

        return False

    def _on_update_workstation(self, cur):
        """
        can use the open cursor to update other things than the workstation's standard attributes
        :param cur: an open cursor embedded in a transaction. This here will not commit!
        :exception: can throw all kinds of exceptions. Has no return value.
        """
        pass

    def _update(self):
        """updates a RecordingWorkstation in the database under the current ID.
           Does not recreate the workstation's tables!

        .. note::
            subclasses should not override _update but _on_update_workstation instead.

            does not check if the current ID already exists in the database.
            returns False if the operation failed, which could be due to
            an attempt to create a duplicate id in the database.

        """

        cfg = SyncConfig.get_config()
        if not self._id or not self._exists:
            return False

        if not self.recording_group:
            self.recording_group = cfg.default_recording_group

        if not get_file_handling_set(self.recording_group, cfg):
            logging.error(f"{self.__class__.__name__}._update: Cannot update RecordingWorkstation "
                          f"because there is no file handling set defined"
                          f" for recording group {self.recording_group}")
            return False

        cur = KioskSQLDb.get_cursor()
        if cur is not None:
            try:
                self._on_update_workstation(cur)

                sql = (f"\"repl_workstation\" set \"description\"=%s, \"recording_group\"=%s, "
                       f"\"user_time_zone_index\"=%s, \"grant_access_to\"=%s,\"recording_time_zone_index\"=%s "
                       f"where \"id\"=%s")

                cur.execute("Update " + sql, [self.description, self.recording_group,
                                              self.user_time_zone_index, self.grant_access_to,
                                              self.recording_time_zone_index,
                                              self._id])
                KioskSQLDb.commit()

                return True
            except Exception as e:
                logging.error("Exception in Workstation._update: " + repr(e))
                KioskSQLDb.rollback()

        else:
            logging.error('No Model cursor in RecordingWorkstation._update')

        return False

    @classmethod
    def list_workstations(cls):
        """
        returns the ids of all workstations.

        This lists the workstations of THIS type! Other workstation types might
        store their workstation information somewhere else. That is why it is a
        class method. For clarity it could move to FileMakerWorkstation but that could easily
        lead to duplicate code.

        :return: List of workstation-ids (which are simple strings)

        """
        cur = KioskSQLDb.get_dict_cursor()
        try:
            result_list = []
            if cur:
                sql = "select " + """repl_workstation.id from repl_workstation  
                          where repl_workstation.workstation_type = %s 
                          order by repl_workstation.description;"""
                cur.execute(sql, [cls.get_workstation_type()])
                for r in cur:
                    result_list.append(r["id"])
                return result_list
            else:
                logging.error(f"{cls.__name__}.list_workstations: KioskSQLDb.get_cursor() failed.")
        except Exception as e:
            logging.error(f"{cls.__name__}.list_workstations: Exception occured: {repr(e)}")

        return []

    def _get_workstation_attribute_from_db(self, column):
        """
            retrieves the value from a column in the table repl_workstation of the database
            todo: redesign
            todo: refactor
        """
        cur = KioskSQLDb.get_cursor()
        cur.execute('SELECT "' + column + '" from "repl_workstation" where id=%s', [self._id])
        v = cur.fetchone()
        cur.close()
        if v:
            v = v[0]
        return v

    def get_state(self) -> str:
        """
            returns the state of the workstation as reported by the state_machine (it is a string)
            :returns: str: a state_machine state or None, if the state_machine's state is not initialized.
        """
        return self.state_machine.get_state()

    def _set_state(self, new_state, commit=True):
        """sets and persists a new state for the workstation.

        .. note::

            does not check if the workstation exists in the database and
            does not check if the new state is a valid transition from the
            current state.
            but it does check if new_state is a valid state at all

        """
        try:
            if self.state_machine.state_exists(new_state):
                old_state = self.state_machine.get_state()
                if self.state_machine.override_state(new_state):
                    if self._save_state(commit):
                        return True
                    else:
                        self.state_machine.override_state(old_state)
            else:
                logging.error(f"workstation._set_state: state {new_state} does not exist for workstation {self._id}")
        except Exception as e:
            logging.error(
                f"Exception in workstation._set_state when setting to state {new_state}: {repr(e)}")
        return False

    def _save_state(self, commit=True):
        """saves the workstation's state to the database.

        .. note::

            this is an abstract method in class workstation.
            subclasses must override it.

        """
        new_state = "ERROR in get_state()"
        try:
            new_state = self.state_machine.get_state()
            cur = KioskSQLDb.get_cursor()
            state_code = self.get_code_from_state(new_state)

            cur.execute("UPDATE" + " \"repl_workstation\" SET state=%s where id=%s", [state_code, self._id])
            cur.close()
            if commit:
                KioskSQLDb.commit()
            return True
        except Exception as e:
            logging.error(
                f"Exception in workstation._save_state when setting to state {new_state}: {repr(e)}")
            try:
                # noinspection PyUnboundLocalVariable
                cur.close()
            except:
                pass
        return False

    def set_temporary_status(self, new_state: str):
        """ overrides the current workstation's status temporarily. The new state will not be
            saved.

            Only for testing purposes.

        """
        self.state_machine.override_state(new_state)

    def get_id(self):
        """
            returns the workstation's id (a string)
            :returns
                workstation id (String)
        """
        return self._id

    def get_description(self):
        """
            returns the workstation's description (a string)
            :returns
                workstation description (String)
        """
        return self.description

    def get_available_transitions(self) -> [str]:
        """ returns a list of available transitions relative to the workstation's current state.
            The list is a list with transition names (strings)
        """
        return self.state_machine.available_transitions()

    def transition(self, transition_name: str, param_callback_progress=None, commit=True):
        """ executes a transition which will or should lead to a state change """
        begin_state = self.state_machine.get_state()
        result = False
        try:
            if param_callback_progress:
                self.callback_progress = param_callback_progress
            self.state_machine.execute_transition(transition_name)
            result = True
        except Exception as e:
            logging.error(f"Exception in workstation.transition: {repr(e)}")

        if self.state_machine.get_state() != begin_state:
            if not self._save_state(commit=commit):
                logging.error(
                    (f"error in workstation.transition: execute_transition succeeded but _save_state failed."
                     f"State {self.get_state()} only temporarily set for workstation {self.get_id()}."))
                result = False
        if result:
            kioskrepllib.log_repl_event(event="dock changed state",
                                        message=f"dock now in state {self.state_machine.get_state()}",
                                        dock=self._id,
                                        level=1,
                                        commit=commit)
        return result

    def _on_delete_workstation(self, cur, migration):
        """ Sub-classes may add something to the deletion process."""
        pass

    def _get_tables_to_delete(self, workstation_dsd):
        tables = workstation_dsd.list_tables()
        return tables

    def delete(self, commit=False):
        """
            Deletes a workstation and all of its contents from the database.
            Does not commit the database changes by default unless commit is set to True.
            Subclasses shoud not override this one but _on_delete_workstation instead.

            :param commit: if set to True the changes will be committed automatically. That includes
                           rolling back pending changes of the ongoing transaction!

            :returns true/false

            .. note: No matter if commit is set to False, in case of an error the database changes
                     will be rolled back and with them all the pending changes of the ongoing transaction.

        """
        if not self.exists():
            return True
        rc = False

        try:
            if commit:
                KioskSQLDb.rollback()
        finally:
            pass

        workstation_dsd = self._get_workstation_dsd()

        cur = None
        try:
            cur = KioskSQLDb.get_cursor()
            tables = self._get_tables_to_delete(workstation_dsd)

            migration = PostgresDbMigration(workstation_dsd, KioskSQLDb.get_con())
            for table in tables:
                logging.debug("deleting %s" % (self._id + "_" + table))
                migration.drop_table(self._id + "_" + table, namespace=self._db_namespace)

            try:
                cur.execute("delete from migration_catalog where namespace=%s", [self._id])
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.delete: Error deleting {self._id} "
                              f"from migration catalog: {repr(e)}")

            logging.debug("removing record in repl_workstation for " + self._id)
            cur.execute("delete from repl_workstation where id=%s", [self._id])

            logging.debug("removing record in kiosk_workstation for " + self._id)
            cur.execute("delete from kiosk_workstation where id=%s", [self._id])

            self._on_delete_workstation(cur, migration)
            if self._db_namespace:
                cur.execute(f"DROP SCHEMA IF EXISTS {KioskSQLDb.sql_safe_ident(self._db_namespace)} CASCADE;")
            if commit:
                KioskSQLDb.commit()
                logging.debug("deletion of " + self._id + " committed.")
            kioskrepllib.log_repl_event("synchronization", "synchronization aftermath FAILED",
                                        "", commit=commit)
            rc = True
        except Exception as e:
            logging.error("Exception in RecordingWorkstation.delete: " + self._id + ": " + repr(e))
            try:
                KioskSQLDb.rollback()
                logging.info("->Rolled back workstation " + self._id)
            except:
                logging.error("Exception in RecordingWorkstation.delete during rollback: " + self._id)
        try:
            cur.close()
        except:
            pass

        return rc

    def partakes_in_synchronization(self):
        """
            signals to the synchronization process whether this workstation is taking part
            in synchronization.

            Abstract. Has to be implemented by all subclasses.

            :returns true/false

        """
        raise NotImplementedError("Call to abstract Workstation.partakes_in_synchronization")

    def ready_for_synchronization(self):
        """
            signals to the synchronization process whether this workstation is ready for synchronization
            If this returns false the synchronization process will issue a warning that can be skipped.

            Abstract. Should be implemented by all subclasses. If not this default handler will return "false"

            :returns true/false

        """
        return False

    def needs_synchronization(self):
        """
            signals to the synchronization process whether this workstation is in a state that needs synchronization.

            Abstract. Should be implemented by all subclasses. If not this default handler will return "false"

            :returns true/false

        """
        return False

    def on_synchronized(self):
        """
            triggered from outside as soon as the synchronization process was successful.
            The workstation should turn its internal state to something like "IDLE"

            Abstract. Needs to be overridden by subclasses.

            :return: True/False
        """
        raise NotImplementedError("Call to abstract Workstation.on_synchronized.")

    def get_and_init_files_dir(self, direction="import", init=True):
        """ returns the path to the workstation's files-directory. Depending on the
            parameter direction it is either the "import" or the "export" directory.\n

            :param direction: optional. "import" (default value) or "export" depending on
                    which directory is requested.
            :param init: optional. If set to False missing directories will NOT be created.
            :return: "" or the path of the requested directory.
                     If the directory does not exist, it will be created.

                     The directories will not be emptied if they exist!

            todo: redesign towards using only a filemaker dir.
                  Workstations should be subdirectories with import/export subdirectories
            todo: this would not apply to a workstation that does not upload files.
                  So I think it belongs to FileMakerWorkstation, where it is implemented.
            todo refactor: Perhaps this needs a more abstract name? It is used in synchronization for
                  all workstations.
        """

        raise NotImplementedError

    def get_port(self):
        """
            returns the dock's port as stored in the database
        """
        return self._get_workstation_attribute_from_db("recording_group")

    def get_recording_group(self):
        return self.get_port()

    def set_port(self, port, commit=True):
        """
            sets and persists a port for the workstation
        """
        cur = KioskSQLDb.get_cursor()
        try:
            cur.execute('UPDATE ' + '"repl_workstation" SET recording_group = %s where id=%s',
                        [port, self._id])
            cur.close()
            if commit:
                KioskSQLDb.commit()
            return True
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.set_port: "
                          f"Exception: port cannot be set to {port} "
                          f"for workstation {self._id}: {repr(e)}")
            try:
                if cur:
                    cur.close()
            except:
                pass
        return False

    def set_recording_group(self, recording_group: str, commit=True):
        self.set_port(recording_group, commit)


# noinspection PyAbstractClass
# this is just to keep the old name where it is still used to avoid a horror refactoring
class Workstation(Dock):
    pass
