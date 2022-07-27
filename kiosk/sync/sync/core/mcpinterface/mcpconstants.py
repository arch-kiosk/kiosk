MCP_STORE = "kiosk_mcp"
MCP_JOB = "job"
MCP_JOB_LOG = "joblog"
KEY_MCP_PULSE = "pulse_mcp"
KEY_MCP_VER = "mcp_ver"
MCP_PULSE_TIMEOUT = 10


class MCPNotRunningError(Exception):
    pass


class MCPLockError(Exception):
    pass


class MCPJobStatusError(Exception):
    pass


class MCPJobValidationError(Exception):
    pass


class MCPJobUnknownError(Exception):
    pass


class MCPJobStatus:
    JOB_STATUS_GHOST = 0  # the job is not registered with MCP, yet
    JOB_STATUS_REGISTERED = 1  # the job is known to MCP but not running, yet
    JOB_STATUS_SUSPENDED = 5
    JOB_STATUS_STARTED = 8  # os process has been started but not picked up the job, yet
    JOB_STATUS_RUNNING = 10
    JOB_STATUS_CANCELLING = 15
    JOB_STATUS_DONE = 20
    JOB_STATUS_CANCELLED = 21
    JOB_STATUS_ABORTED = 22

    STATUS_TO_STR = {JOB_STATUS_GHOST: "JOB_STATUS_GHOST",
                     JOB_STATUS_REGISTERED: "JOB_STATUS_REGISTERED",
                     JOB_STATUS_SUSPENDED: "JOB_STATUS_SUSPENDED",
                     JOB_STATUS_STARTED: "JOB_STATUS_STARTED",
                     JOB_STATUS_RUNNING: "JOB_STATUS_RUNNING",
                     JOB_STATUS_CANCELLING: "JOB_STATUS_CANCELLING",
                     JOB_STATUS_DONE: "JOB_STATUS_DONE",
                     JOB_STATUS_CANCELLED: "JOB_STATUS_CANCELLED",
                     JOB_STATUS_ABORTED: "JOB_STATUS_ABORTED"
                     }
