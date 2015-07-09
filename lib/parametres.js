
module.exports = {
    
    folderName: 'kodi',
    // Inject Boxs in dashboard
    // dashboadBoxs is an array of dashboardBox 
    dashboardBoxs: [{
        title: 'Kodi/XBMC',
        // the name of your Angular Controller for this box (put an empty string if you don't use angular)
        ngController: 'kodiController as vm',
        file : 'box.ejs',
        icon: 'fa fa-play',
        type: 'box-primary'
    }],
    // link assets to project
    linkAssets: true
};