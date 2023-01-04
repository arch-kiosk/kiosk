import datetime
import logging
import os.path
from typing import Union

import kioskglobals
import kiosklib
import kioskstdlib
import urapdatetimelib
from messaging.systemmessagecatalog import SYS_MSG_ID_BACKUP_REMINDER


class BackupReminder:
    @classmethod
    def check_last_backup(cls, cfg=None):
        try:
            if not cfg:
                cfg = kioskglobals.get_config()
            backup_reminder_days = int(kioskstdlib.try_get_dict_entry(cfg.kiosk, 'backup_reminder_days', '0'))
            if not backup_reminder_days:
                return
            reminder_file = cls.get_reminder_filename(cfg)
            try:
                days_since_reminder = kioskstdlib.get_file_age_days(reminder_file, use_modification_date=True)
            except BaseException as e:
                cls.set_backup_reminder(cfg)
                days_since_reminder = 0
            try:
                backup_date = cls.get_backup_datetime(cfg)
                if backup_date:
                    days_since_backup = (datetime.datetime.now() - backup_date).days
                    msg = f"Your last backup was about {days_since_backup} days ago."
                else:
                    raise Exception()
            except:
                msg = f"Your last backup was a while ago or you have not conducted one at all, yet."

            if days_since_reminder >= backup_reminder_days:
                kiosklib.dispatch_system_message(f"{msg}",
                                                 SYS_MSG_ID_BACKUP_REMINDER,
                                                 body="Please backup your data and file repository. "
                                                      "The best moment to do that is while all workstations "
                                                      "are in the field.",
                                                 sender=f"backup_reminder")
                cls.set_backup_reminder(cfg)

        except BaseException as e:
            logging.error(f"{cls.__name__}.check_last_backup: {repr(e)}")
        return

    @classmethod
    def set_backup_datetime(cls, cfg=None, new_datetime: datetime.datetime = None, unknown_backup = False):
        """
        sets the date and time of the backup (and the date and time of the last reminder).
        :param cfg:
        :param new_datetime: optional. If not set now is going to be used.
        """
        reminder_file = cls.get_reminder_filename(cfg)
        set_datetime = new_datetime if new_datetime else datetime.datetime.now()
        with open(reminder_file, "w") as f:
            if unknown_backup:
                f.write("unknown")
            else:
                f.write(set_datetime.isoformat())
        cls.set_backup_reminder(cfg, new_datetime=set_datetime)

    @classmethod
    def get_backup_datetime(cls, cfg=None) -> Union[datetime.datetime, None]:
        """
        returns the datetime of the last backup
        returns: None if the datetime of the last backup is unknown otherwise a datetime.datetime
        """
        reminder_file = cls.get_reminder_filename(cfg)
        with open(reminder_file, "r") as f:
            iso_ts = f.read()
        if iso_ts == 'unknown':
            return None
        else:
            return datetime.datetime.fromisoformat(iso_ts)


    @classmethod
    def set_backup_reminder(cls, cfg=None, new_datetime: datetime.datetime = None):
        """
        sets the date and time of the last reminder.
        :param cfg:
        :param new_datetime: optional. If not set, now is going to be used.
        """
        reminder_file = cls.get_reminder_filename(cfg)
        set_datetime = new_datetime if new_datetime else datetime.datetime.now()
        if os.path.exists(reminder_file):
            os.utime(reminder_file, (set_datetime.timestamp(), set_datetime.timestamp()))
        else:
            cls.set_backup_datetime(cfg, unknown_backup=True)

    @classmethod
    def get_reminder_filename(cls, cfg):
        if not cfg:
            cfg = kioskglobals.get_config()
        # backup_dir = cfg.resolve_symbols(cfg.kiosk["administrationplugin"]["defaults"]["backup_directory"])
        reminder_file = os.path.join(cfg.base_path, 'backup.reminder')
        return reminder_file
