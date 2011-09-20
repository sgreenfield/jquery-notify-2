/*
 * jQuery Notify UI Widget 1.4
 * Copyright (c) 2010 Eric Hynds
 *
 * http://www.erichynds.com/jquery/a-jquery-ui-growl-ubuntu-notification-widget/
 *
 * Depends:
 *   - jQuery 1.4
 *   - jQuery UI 1.8 widget factory
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *  **HEY!  READ THIS!**
 *  This is the stripped down version of the plugin.  If you need templating built in, please visit the original author's web site
 *  http://www.erichynds.com/jquery/a-jquery-ui-growl-ubuntu-notification-widget/
 *
 * This version assumes you are handeling templating OUTSIDE of the plugin.
 * Updates to this version can be found here:  https://github.com/sgreenfield/jquery-notify-2
 * 
    $('#someContainer').notify("create", {
      html: someRenderedTemplate
    });
  *  
*/

(function($){

$.widget("ech.notify", {
	options: {
		speed: 500,
		expires: 5000,
		stack: 'below',
		custom: false,
        queue: false,
        html: '<div></div>'
	},
	_create: function(){
		var self = this;

		this.element.addClass("ui-notify").show();
	},
	create: function(opts){
        this.openNotifications = this.openNotifications || 0;
        return new $.ech.notify.instance(this)._create($.extend({}, this.options, opts));            
	}
});

// instance constructor
$.extend($.ech.notify, {
	instance: function(widget){
		this.parent = widget;
		this.isOpen = false;
	}
});

// instance methods
$.extend($.ech.notify.instance.prototype, {
	_create: function(options){
        var self = this;

		this.options = options;
        this.element = $(options.html).addClass("ui-notify-message ui-notify-message-style");
		
		// clickable?
		if(typeof this.options.click === "function"){
			this.element.addClass("ui-notify-click").bind("click", function(e){
				self._trigger("click", e, self);
			});
		}

        this.element.find(".ui-notify-close").bind("click", function(){
            self.close();
            return false;
        });

        this.parent.element.queue('notify', function(){
          self.open();

          // auto expire?
          if(typeof options.expires === "number"){
              window.setTimeout(function(){
                  self.close();
              }, options.expires);
          }
          
        });

        if(!this.options.queue || this.parent.openNotifications <= this.options.queue - 1) this.parent.element.dequeue('notify');
        
		return this;
	},
	close: function(){
		var self = this, speed = this.options.speed;

		this.element.fadeTo(speed, 0).slideUp(speed, function(){
			self._trigger("close");
			self.isOpen = false;
            self.element.remove();
            self.parent.openNotifications -= 1;
            self.parent.element.dequeue('notify');
		});
		
		return this;
	},
	open: function(){
		if(this.isOpen || this._trigger("beforeopen") === false){
			return this;
		}

		var self = this;

        this.parent.openNotifications += 1;
		
		this.element[this.options.stack === 'above' ? 'prependTo' : 'appendTo'](this.parent.element).css({ display:"none", opacity:"" }).fadeIn(this.options.speed, function(){
			self._trigger("open");
			self.isOpen = true;
		});
		
		return this;
	},
	widget: function(){
		return this.element;
	},
	_trigger: function(type, e, instance){
		return this.parent._trigger.call( this, type, e, instance );
	}
});

})(jQuery);
