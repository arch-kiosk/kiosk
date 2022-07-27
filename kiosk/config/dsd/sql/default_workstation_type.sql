update repl_workstation
set workstation_type='filemakerworkstation'
where repl_workstation.workstation_type is null;
