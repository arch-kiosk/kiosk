from plugins.filemakerrecording.filemakercontrolwindows import FileMakerControlWindows


class CreateDSDFromFM:

    def __init__(self, pathandfilename, userid, pwd):
        self.fm = FileMakerControlWindows()
        self.cnxn = self.fm.start_independent_fm_database(pathandfilename, userid, pwd)
        self.field_type_translation = {
                                        "timestamp": "TIMESTAMP",
                                        "varchar": "VARCHAR",
                                        "decimal": "NUMBER",
                                        "date": "DATE",
                                        "blob": "!!!FILE!!!"
                                      }
        self.skippable_fields = [
                                "fqid", "calcimageattributes", "fqid_sort", "addrec", "g_addrec", "sync_ts",
                                "isvalid"
                                ]
        self.tables = ['collected_material', 'collected_material_photo', 'dayplan',
                       'excavator', 'feature', 'feature_locus', 'images', 'locus', 'locus_architecture', 'locus_deposit', 'locus_othertype',
                       'locus_photo', 'locus_relations', 'locus_types', 'lot', 'period_egypt', 'period_nubia', 'pottery',
                       'site', 'small_find', 'tickets', 'unit', 'unit_narrative']

    def get_yaml(self, filename=None):
        out_yml = ""
        for tbl in self.tables:
            yml = self.get_table_yaml(tbl)
            if yml:
                out_yml += yml
        if not filename:
            return(out_yml)
        else:
            with open(filename, mode='w') as f:
                f.write(out_yml)

    def get_table_yaml(self, tablename, version="current_structure"):
        cur = self.cnxn.cursor()
        indent = "  "
        CR = "\n"
        yml = tablename + ":\n"
        yml += indent + version + ": \n"
        repl_fields = {}
        repl_field_count = 0
        for r in cur.columns(tablename):
            field_name = r[3].lower()
            field_type = r[5].lower()
            if field_name == "uid":
                repl_fields[field_name] = "REPLFIELD_UUID"
                repl_field_count += 1
            elif field_name == "created":
                repl_fields[field_name] = "REPLFIELD_CREATED"
                repl_field_count += 1
            elif field_name == "modified":
                repl_fields[field_name] = "REPLFIELD_MODIFIED"
                repl_field_count += 1
            elif field_name == "modified_by":
                repl_fields[field_name] = "REPLFIELD_MODIFIED_BY"
                repl_field_count += 1
            elif field_name in self.skippable_fields:
                print("Table " + tablename + ", field " + field_name + " skipped")
            else:
                if field_type in self.field_type_translation:
                    field_type = self.field_type_translation[field_type]
                else:
                    print("\n" + field_name + " has unknown fieldtype " + field_type)
                yml += indent + indent + field_name + ": [" + field_type + "]" + CR

        if repl_field_count == 4:
            for ft in ["REPLFIELD_UUID", "REPLFIELD_CREATED", "REPLFIELD_MODIFIED", "REPLFIELD_MODIFIED_BY"]:
                for fld in repl_fields:
                    if repl_fields[fld] == ft:
                        yml += indent + indent + fld + ": [" + repl_fields[fld] + "]" + CR

        else:
            print("   \n !!! Table " + tablename + " has no uid field and will be omitted. \n")
            yml = ""
        return(yml)
