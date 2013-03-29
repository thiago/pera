/**
 * Created with PyCharm.
 * User: thiago.rodrigues
 * Date: 11/09/12
 * Time: 17:33
 * To change this template use File | Settings | File Templates.
 */


(function($) {
    $.fn.extend({
        serializeFormJSON : function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        outerHTML : function( value ){
            if( typeof value === "string" ){
                var $this = $(this), $parent = $this.parent();
                var replaceElements = function(){
                    var element;
                    $( value ).map(function(){
                        element = $(this);
                        $this.replaceWith( element );
                    })
                    return element;
                }
                return replaceElements();
            }else{
                return $("<div />").append($(this).clone()).html();
            }
        }
    });
})(jQuery);