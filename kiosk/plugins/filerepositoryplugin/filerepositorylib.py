import copy
import logging
from typing import Union

import kioskglobals
from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import KIOSK_GENERAL_CACHE_REFRESH, JOB_SUFFIX_REFRESH_FID_CACHE
from mcpinterface.mcpjob import MCPJob, find_running_job


#
# todo: refactor / redesign
# Plugin-specific methods
#
def get_std_file_images(plugin):
    cfg = plugin.plugin_config("file_icons")
    if cfg:
        return cfg
    else:
        return {}


#
# todo: refactor / redesign
# Plugin-specific methods
# this needs to be available to the public
#
def get_file_description_priorities(plugin, priority_set=""):
    priority_sets = plugin.plugin_config("file_descriptions")
    if priority_set and priority_set in priority_sets:
        return copy.deepcopy(priority_sets[priority_set])
    else:
        try:
            return copy.deepcopy(priority_sets[next(iter(priority_sets))])
        except Exception as e:
            print("Exception: >>>>>>> " + repr(e))
            print(priority_sets)

def trigger_fid_refresh_if_needed(gs: GeneralStore, force=False) -> Union[str, None]:
    """
    queues a fid refresh job if the fid cache needs a refresh.
    If there is already a running or waiting fid refresh job this will not queue another one.
    Yes, there is a slight race condition, but fid caches are not THAT critical, so why bother...

    :param gs: the general store
    :param force: forces the refresh no matter if it seems necessary
    :return: None or the job id of the Kiosk Job
    :raises lets all Exceptions through
    """
    if force or not gs.is_cache_valid(KIOSK_GENERAL_CACHE_REFRESH):
        if not find_running_job(kioskglobals.general_store, JOB_SUFFIX_REFRESH_FID_CACHE):
            errors = []

            job_data = {}
            job = MCPJob(gs, job_type_suffix=JOB_SUFFIX_REFRESH_FID_CACHE)
            job.set_worker("plugins.administrationplugin.refreshfidcacheworker", "RefreshFidCacheWorker")
            job.background_job = False
            job.job_data = job_data
            job.queue()
            job_uid = job.job_id

            return job_uid

    return None
