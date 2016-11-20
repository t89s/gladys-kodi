# Gladys Kodi
Require Gladys >= 3.3.2

##Features

**Launch scenario:**

- When Kodi stop a media (status:0)
- When Kodi pause a media (status:1)
- When Kodi play a media (status:2)


## Installation
- Install the module in Gladys
- Reboot Gladys
- In Kodi, go to Settings => Services => Remote Control then enabled the option "Allow programs on other systems to control XBMC"
- In Gladys, go to "Parameters" => "Parameters" => "Parameters" in the dashboard, and create parameters:
 - `kodi_devices` host:port separated by comma. (raspbmc.local:9090,192.168.0.1:9090)
- In Gladys, go to "Modules" => "Installed modules", and click on the configure button.
- Your device(s) should be available(s) in devices page, you can update the room of device(s).