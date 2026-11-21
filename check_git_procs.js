const { execSync } = require('child_process');
const out = execSync('powershell -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -like \'*git*\' } | Select-Object ProcessId, CommandLine | Format-Table -Wrap -AutoSize"').toString();
console.log(out);
