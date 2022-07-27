# set this version to something project-specific if you are unsure whether MCP starts workers that import code modules
# from the proper kiosk environment. When a process is started it logs the testversion it imports
# from the kiosk environment. Different projects with different TEST_VERSION values should be distinguishable.
# look for a log entry in the MCP-job log that looks like this:
#
# mcpworker.INFO at 2021-07-22 19:12:04,010]: MCP: xyz runs within a kiosk environment with code-version KIOSK-1.
#
TEST_VERSION = 'KIOSK-1'

