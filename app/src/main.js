
(async ()=>{
    let $ = (await import("jquery")).default;
    let config = ((await import('./appster_config.js')).default).default;
    let Vue = (await import("vue")).default;
    let VueRouter = (await import ('vue-router')).default;
    let Vuex = (await import ('vuex')).default;
    let VueAceEditor = (await import("vue2x-ace-editor")).default;
    await import ('es6-promise/auto');
    await import ('brace/ext/language_tools');
    await import ('brace/mode/json');
    await import ('brace/mode/text');
    await import ('brace/mode/javascript');
    await import ('brace/mode/html');
    await import ('brace/theme/chrome');
    await import ('brace/ext/beautify');
    await import ('brace/ext/chromevox');
    await import ('brace/ext/error_marker');
    await import ('brace/ext/keybinding_menu');
    await import ('brace/ext/language_tools');
    await import ('brace/ext/linking');
    await import ('brace/ext/modelist');
    await import ('brace/ext/searchbox');
    await import ('brace/ext/settings_menu');
    await import ('brace/ext/spellcheck');
    await import ('brace/ext/static_highlight');
    await import ('brace/ext/statusbar');
    await import ('brace/ext/themelist');

    let axios = (await import("axios")).default;
    let BootstrapVue = (await import('bootstrap-vue')).default;
    await import('bootstrap/dist/css/bootstrap.css');
    await import('bootstrap-vue/dist/bootstrap-vue.css');
    let remoteModule = (await import ("./remoteModule")).default;

    $, config, Vue, Vuex, VueRouter, VueAceEditor, BootstrapVue, remoteModule; //eslint bypass, not explicitly accessing these variables will throw an error.

    let baseUrl = 'http://' + config.apiIp + ':' + config.apiPort + config.apiExt;
    Vue.prototype.baseUrl = baseUrl;

    let settings = await axios.get(baseUrl + 'settings');

    let mainModule = await axios.get(baseUrl + 'module/' + settings.data[0].mainFrontendModuleId);
    let mainModuleScript = await axios.get(baseUrl + 'script/' + mainModule.data.javascriptId);

    mainModule = await eval('(async ()=>{return await ' + mainModuleScript.data.code + '})()');
    mainModule();
})()
