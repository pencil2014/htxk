require.config({
    paths: {
        "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
        "hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
        "template": "/resources/js/match/template.js?v=90fc02a1d0",
        'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
        'common': '/resources/js/common/common.js?v=f486ed9e43',
        'commonUtil': '/resources/js/common/commonUtil.js?v=e97071eff8',
        'i18n': '/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
        "validate": "/resources/js/jquery/jquery.validate.min.js?v=37393e7134",
        "cookie": "/resources/js/jquery/jquery.cookie-1.4.1.js?v=a79ce0f6ee",
        'formVeriy': '/resources/js/user/formVerify.js?v=c4692bf293',
        'md5': '/resources/js/jquery/jquery.md5.js?v=c37a6ec65a'
    },
    shim: {
        'validate': {
            deps: ['jquery']
        },
        'cookie': {
            deps: ['jquery']
        },
        'layer': {
            deps: ['jquery']
        },
        "hhlyAction": {
            deps: ['jquery', 'layer']
        },
        'formVeriy': {
            deps: ['jquery', 'validate', 'layer']
        },
        'md5': {
            deps: ['jquery']
        },
        'common': {
            deps: ['jquery', 'commonUtil', 'hhlyAction']
        }
    },
    /*  urlArgs: "bust=" + (new Date()).getTime()*/
});