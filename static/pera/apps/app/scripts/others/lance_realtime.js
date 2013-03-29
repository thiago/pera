/**
 * Created with PyCharm.
 * User: thiagorsouz
 * Date: 09/03/13
 * Time: 23:01
 * To change this template use File | Settings | File Templates.
 */

//clear interval for development
if(Monitor){
	Monitor.stop();
}

var Monitor     = {
	init: function (args){
		args                = args          || {};
		this.intervalTime   = args.time     || 200;
		this.id             = args.id       || window.location.href.split('productid=')[1];
		this.idPanel        = args.idPanel  || 'panelMonitoringShot';
		this.setPanelStyle();
		return this;
	},
	start: function (){
		var self            = this;
		this.interval       = setInterval(function(){
			self.verify();
		}, this.intervalTime);
	},
	stop: function (){
		if(this.interval){
			clearInterval(this.interval);
		}else{
			console.log('interval not started');
		}
	},
	getPanel: function (){
		var panel         = $('#' + this.idPanel);
		return panel.length ? panel : $("<div>").attr('id', this.idPanel).appendTo('body');
	},
	setPanelStyle: function (){
		this.getPanel().css({
			backgroundColor: '#ffffff',
			border: 'solid 1px #cccccc',
			position: 'fixed',
			padding: '10px',
			right: 0,
			top: 0
		});
	},
	verify: function (){
		var self                = this;
		var currentValue        = $('#Amt' + this.id);
		var timerCount          = $('#Bid' + this.id);
		var btn                 = $('#btBidActive_' + this.id);
		var desc                = $('#desc_final' + this.id);

		if(currentValue.length){
			currentValue          = currentValue.text().split("R$ ")[1];
			desc                  = desc.text().split("%")[0];
			$('.ui-button').click();
			timerCount.each(function(){
				if(currentValue){
					var timerEnd    = $(this).text().split(':');
					if(timerEnd.length > 0){
						try{
							var value       = parseFloat(currentValue.replace(',', '.'));
							var hr          = parseFloat(timerEnd[0]);
							var min         = parseFloat(timerEnd[1]);
							var seg         = parseFloat(timerEnd[2]);
							var timeTotal   = new Date();
							var timeNow     = new Date();
							var timeEnd     = 0;
							timeTotal.setHours(timeTotal.getHours() + hr);
							timeTotal.setMinutes(timeTotal.getMinutes() + min);
							timeTotal.setSeconds(timeTotal.getSeconds() + seg);
							timeEnd         = timeTotal.getTime() - timeNow.getTime();
							timeEnd         = timeEnd / 1000;
							switch(timeEnd){
								case 1:
								case 2:
								case 3:
								case 4:
								case 5:
								case 6:
								case 7:
								case 8:
								case 9:
								case 10:
								case 11:
								case 12:
								case 13:
								case 14:
								case 15:
									console.log('btn.click()', timeEnd);
									break;
								default:
								//console.log('default action', timeEnd);
							}
							//put information inside panel
							var panelInfo       = '<p><b>Preço autal:</b> ' + value + '</p>'
								+ '<p><b>Segundos restantes:</b> ' + timeEnd + '</p>'
								+ '<p><b>Desconto:</b> ' + desc + '%</p>';

							self.getPanel().html(panelInfo);

						}catch(e){
							//console.log('timer not found');
						}
					}
				}
			});
		}
	}
};

Monitor.init().start();