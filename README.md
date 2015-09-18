##Features
Dashboard:
* Remote control
* Edit device

Launch scenario:
* When Kodi play a media
* When Kodi pause a media
* When Kodi stop a media

Launch action:
* Play a music to Kodi


**The scenario events works when you use another remote control.** (Tv remote control, App ...)

##Installation
```bash
# Go to the hooks directory
$ cd api/hooks

# Clone the repository
$ git clone https://github.com/Time-Lords/gladys-kodi.git kodi
$ cd kodi

# Install NPM dependencies
$ npm install
```
##Usage

**On Kodi**
* Go to Settings => Services => Remote Control.
* Enabled the option "Allow programs on other systems to control XBMC"

**On Gladys**
* Go to Dashboard => XBMC/Kodi => Settings => Add device.
*(The default port is 9090)*
