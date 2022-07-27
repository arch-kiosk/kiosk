import psycopg2, psycopg2.extras
from datetime import datetime

# this script compares the typical urap database tables in two different databases and gives information
# about new records and differing modification dates.
from test.testhelpers import KioskPyTestHelper

if __name__ == '__main__':
    print("starting...")
    helper = KioskPyTestHelper()
    config = helper.get_standard_test_config(__file__)

    vm_con = psycopg2.connect(
        f"dbname=vm_server_urap user={config.database_usr_name} password={config.database_usr_pwd}")
    vm_con.autocommit = True

    local_con = psycopg2.connect(
        f"dbname=local_server_urap user={config.database_usr_name} password={config.database_usr_pwd}")
    local_con.autocommit = True

    tables = ["locus", "images", "unit", "site", "site_notes",
              "collected_material", "small_find", "collected_material_photo", "unit_narrative",
              "pottery", "dayplan", "feature_unit", "locus_architecture", "locus_deposit", "locus_othertype",
              "locus_photo", "locus_relations", "locus_types", "lot", "pottery_images", "site_note_photo",
              "survey_unit", "survey_unit_data", "tags", "tagging", "inventory"]  # , "unit", "site"

    vm_cur = vm_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
    local_cur = local_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
    tables.sort()
    try:
        for table in tables:
            print(f"Analyzing table {table} ...")
            vm_cur.execute(f"select uid, modified from {table}")
            vm_uids = list(vm_cur.fetchall())
            # print(f"vm.{table} has {len(vm_uids)} uids ...")

            local_cur.execute(f"select uid, modified from {table}")
            local_uids = list(local_cur.fetchall())
            # print(f"local.{table} has {len(local_uids)} uids ...")

            new_in_vm = set([x[0] for x in vm_uids]) - set([x[0] for x in local_uids])
            new_in_local = set([x[0] for x in local_uids]) - set([x[0] for x in vm_uids])

            if new_in_vm:
                print(f"!!! {table}: {len(new_in_vm)} lines only in vm")

            if new_in_local:
                print(f"!!! {table}: {len(new_in_local)} lines only in local server")
            c_comp = 0
            c_vm = 0
            c_local = 0
            for vm_r in vm_uids:
                vm_uid, vm_modified = vm_r
                for local_r in local_uids:
                    if local_r[0] == vm_uid:
                        c_comp += 1
                        # local_dt = datetime.strptime(local_r[1], "%Y-%m-%d %H:%M:%S.%f")
                        # vm_dt = datetime.strptime(vm_modified, "%Y-%m-%d %H:%M:%S.%f")
                        local_dt = local_r[1]
                        vm_dt = vm_modified
                        assert isinstance(local_dt, datetime)
                        assert isinstance(vm_dt, datetime)
                        if vm_dt > local_dt:
                            print(f"{table}, {vm_uid}: vm.modified > {vm_modified} != local.modified = {local_r[1]}")
                            c_vm += 1
                        if vm_dt < local_dt:
                            # print(f"{table}: vm.modified < {vm_modified} != local.modified = {local_r[1]}")
                            c_local += 1
            # print(f"table {table}: compared {c_comp} lines.")
            if c_local > 0:
                print(f"!!! table {table}: {c_local} lines newer on local_server")
            if c_vm > 0:
                print(f"!!! table {table}: {c_vm} lines newer on virtual machine")



    except BaseException as e:
        print(f"{repr(e)}")
    finally:
        try:
            local_cur.close()
        except:
            pass
        try:
            vm_cur.close()
        except:
            pass

    vm_con.close()
    local_con.close()
