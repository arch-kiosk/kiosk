# generalstorekeys.py
# constants and documentation for the domains, subdomains and keys used to store something in the GeneralStore.

# domains

kiosk = "kiosk"
sync_core = "sync_core"
kiosk_core = "_".join([kiosk, "core"])
test = "test"
messaging = "_".join([kiosk, "messaging"])

# kiosk root keys
gs_key_kiosk_init_counter = "_".join([kiosk, "init_counter"])
gs_key_user_config = "_".join([kiosk, "user_config"])

# subdomains
sync_core_threaded_job_manager = "_".join([sync_core, "threaded_job_manager"])
kiosk_core_security = "_".join([kiosk_core, "security"])

# sync_core_threaded_job_manager keys
sync_core_threaded_job_manager_job_log = "_".join([sync_core_threaded_job_manager, "job_log"])
sync_core_threaded_job_manager_last_job_id = "_".join([sync_core_threaded_job_manager,
                                                       "last_job_id"])
sync_core_threaded_job_manager_jobs = "_".join([sync_core_threaded_job_manager,
                                               "job_manager_jobs"])
# kiosk_core_security keys
kiosk_core_security_tokens = "_".join([kiosk_core_security, 'tokens'])
kiosk_core_security_user_tokens = "_".join([kiosk_core_security, 'user_tokens'])

sync_core_threaded_job_manager_job = "_".join([sync_core_threaded_job_manager, "job"])

#messaging
messaging_change_mark = "_".join([messaging, "init_counter"])

#caches
KIOSK_GENERAL_CACHE_REFRESH = "_".join([kiosk, "cache", "general"])
JOB_SUFFIX_REFRESH_FID_CACHE = "RI"
JOB_SUFFIX_REFRESH_CACHE_FILE = "RF"


