import logging
from dsd.dsd3 import DataSetDefinition


class FileMakerControl:
    """FileMakerControl class. Parent class and factory class. Use _get_instance() to get a
       cross-plattform instance of a FileMakerControl object that meets the interface of this class.
    """

    # def create_new_export_file(self, work_station):
    #     """
    #     todo: documentation
    #     todo: is this still in use somewhere?
    #     :param work_station:
    #     :return:
    #     """
    #     logging.error("direct call to base class FileMakerControl.create_new_export_file")
    #     return False

    def start_fm_database(self, workstation, *argv):
        logging.error("direct call to base class FileMakerControl.start_fm_database")
        return False

    def transfer_table_data_to_filemaker(self, db_cur, dsd: DataSetDefinition, tablename, latest_record_data=None):
        logging.error("direct call to base class FileMakerControl.transfer_table_data_to_filemaker")
        return False

    def select_table_data(self, dsd: DataSetDefinition, tablename, version=0, import_filter=""):
        """selects the columns from a filemaker table that are defined in the dsd.
           returns the cursor object"""
        logging.error("direct call to base class FileMakerControl.select_table_data")
        return None

    def sync_internal_files_tables(self, files_table: str, columns_to_copy: [str]):
        """
        synchronizes the files table with the files_load table. Note that the modified_by in files has not
        been tampered with at this point (the old records are still in there) and files_load does not automatically
        change modified_by, so it reflects what is currently in the master(postgres) database.

        Records not in files_load are deleted in files,
        records with files.modified_by < files_load.modified_by are deleted, too.

        :param files_table: name of the files table (e.G. "images")
        :param columns_to_copy: the columns to copy from images_load to images (or whatever files_table name is)
        """
        raise NotImplementedError

    def set_constant(self, key, value):
        """sets a key / value pair in the constants-table of the open filemaker - Model"""
        logging.error("direct call to base class FileMakerControl.set_constant")
        return False

    def get_constant(self, key, value):
        """gets a value from the constants-table of the open filemaker - Model"""
        logging.error("direct call to base class FileMakerControl.get_constant")
        return None

    def export_container_images(self, workstation, printdots):
        """Makes filemaker unload all the data from the images table"""
        logging.error("direct call to base class FileMakerControl.export_container_images")
        return False

    def process_repldata_transfer_table(self):
        """starts the script import_replication_data in filemaker and returns the resulting constant
           with the id import_replication_data, which constains the number of records that have been
           imported for any given table in the format "tablename:rowcound\ntablename:rowcount ... """
        logging.error("direct call to base class FileMakerControl.process_repldata_transfer_table")
        return False

    def process_images_transfer_table(self):
        """starts the script import_images in filemaker and returns the resulting constant
           with the id import_images_result, which constains the number of images that have been
           imported for any given table in the format "tablename:rowcount\ntablename:rowcount ... """
        logging.error("direct call to base class FileMakerControl.process_images_transfer_table")
        return False

    @classmethod
    def get_instance(cls):
        from filemakerrecording.filemakercontrolwindows import FileMakerControlWindows
        """returns a cross-plattform instance of a FileMakerControl object that meets the interface of this class.

        .. danger::

            currently it returns only a Windows instance.
        """
        return FileMakerControlWindows()

    @classmethod
    def getfieldvalue(cls, rec, fieldname):
        """Unfortunately it is not really standardized how to access values of a record by column-name.
           Since the classes which use UrapFileMakerControl should not need to know the
           specific database interface used for accessing data, this wrapper helps."""
        logging.error("Access to getfieldvalue of the abstract class UrapFileMakerControl is illegal.")
        return (None)
