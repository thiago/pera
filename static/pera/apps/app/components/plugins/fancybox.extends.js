/**
 * Created with PyCharm.
 * User: Thiago Rodrigues
 * Date: 29/08/12
 * Time: 21:45
 * To change this template use File | Settings | File Templates.
 */

var fancyboxWindowTemplate      = function(arguments){
    var self            = this;
    this.args            = $.extend(true, {
        wrapperClass                : 'window-modal',
        title                       : 'Título default',
        message                     : 'Mensagem default',
        showHeader                  : true,
        showBody                    : true,
        showFooter                  : true,
        closeBtn                    : {
            text                        : '&times;',
            callback                    : null,
            class                       : 'close',
            attr                        : {}
        },
        confirmBtn                  : {
            text                        : 'Ok',
            callback                    : null,
            class                       : 'btn btn-primary',
            attr                        : {}
        },
        cancelBtn                   : {
            text                        : 'Cancelar',
            callback                    : null,
            class                       : 'btn',
            attr                        : {}
        }
    }, arguments);

    /* PRIVATE METHODS */
    add_close_event       = function(obj){
        $(obj).click(function(){
            $.fancybox.close();
        })
    }
    get_html_btn          = function(btnObject){
        if(btnObject){
            var btn      = $('<button>').addClass(btnObject['class']).attr(btnObject['attr']).html(btnObject['text']);
            add_close_event(btn);
            if (typeof(btnObject['callback']) == 'function'){
                btn.click(function(){
                    btnObject['callback']($(this));
                })
            }
            return btn
        }
        return ''
    }

    /* PUBLIC METHODS */

    /* Gets */
    this.get_header   = function(){
        var html            = $('<div class="modal-header">');
        if(self.args['closeBtn'])   html.append(get_html_btn(self.args['closeBtn']));
        html.append('<h3>' + self.args['title'] + '</h3>');
        return html;
    }
    this.get_body    = function(){
        var html            = $('<div class="modal-body">');
        html.append(self.args['message']);
        return html;
    }
    this.get_footer  = function(){
        var html            = $('<div class="modal-footer">');
        if(self.args['cancelBtn'])   html.append(get_html_btn(self.args['cancelBtn']));
        if(self.args['confirmBtn'])  html.append(get_html_btn(self.args['confirmBtn']));
        return html;
    }

    this.get_html  = function(){
        var html            = $('<div>').addClass(self.args['wrapperClass']);
        if(self.args['showHeader']) html.append(self.get_header());
        if(self.args['showBody']) html.append(self.get_body());
        if(self.args['showFooter']) html.append(self.get_footer());
        return html;
    }
}
var fancyboxWindow     = function(arguments){
    var self            = this;
    this.args            = $.extend(true, {
        fancybox                : {
            modal                   : true,
            padding                 : 0,
            beforeShow              : function(){
                //$('.fancybox-wrap').easydrag();
            }
        },
        template                : new fancyboxWindowTemplate()
    }, arguments);

    this.update         = function(){
        self.args['fancybox']['content']    = self.args['template'].get_html();
    }
    this.open            = function(){
        self.update();
        $.fancybox(self.args['fancybox']);
    }
}

function fancyboxWindowAlert(title, msg) {
    fancyboxWindow.call(this);
    this.args.template      = new fancyboxWindowTemplate({
        title           : title,
        message         : msg,
        wrapperClass    : this.args.template.args.wrapperClass + ' alert',
        cancelBtn       : false,
        confirmBtn      : {
            class           : 'btn btn-warning'
        }
    })
    this.open();
}

function fancyboxWindowError(title, msg) {
    fancyboxWindow.call(this);
    this.args.template      = new fancyboxWindowTemplate({
        title           : title,
        message         : msg,
        wrapperClass    : this.args.template.args.wrapperClass + ' alert alert-error',
        cancelBtn       : false,
        confirmBtn      : {
            class           : 'btn btn-danger'
        }
    })
    this.open();
}

function fancyboxWindowConfirm(title, msg, callback) {
    fancyboxWindow.call(this);
    var ret;
    this.args.fancybox.afterClose       = function() {
        callback.call(this, ret);
    }
    this.args.template      = new fancyboxWindowTemplate({
        title           : title,
        message         : msg,
        wrapperClass    : this.args.template.args.wrapperClass + ' confirm',
        cancelBtn       : {
			callback		: function() {
				ret = false;
			}
        },
        confirmBtn      : {
			callback		: function() {
				ret = true;
			},
            text            : 'Confirmar'
        }
    })
    this.open();
}
fancyboxWindowAlert.prototype   = fancyboxWindow;
fancyboxWindowError.prototype   = fancyboxWindow;
fancyboxWindowConfirm.prototype   = fancyboxWindow;
