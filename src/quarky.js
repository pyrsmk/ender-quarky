/*
	quarky, a tiny DOM utility

	Author
		Aurélien Delogu (dev@dreamysource.fr)
*/

(function(){

	var html=document.documentElement,
		body=document.body,
		scrollElement=function(){
			body.scrollTop=1;
			var el=(body.scrollTop==1?body:html);
			body.scrollTop=0;
			return el;
		};

	/*
		Create a node from HTML code

		Parameters
			String html

		Return
			Object

		Notes
			Based on Bonzo's method (https://github.com/ded/bonzo)
	*/
	$.create=function(html){
		var table=['<table>','</table>',1],
			td=['<table><tbody><tr>','</tr></tbody></table>',3],
			option=['<select>','</select>',1],
			noscope=['_','',0],
			tags={
				thead:table,
				tbody:table,
				tfoot:table,
				colgroup:table,
				caption:table,
				tr:['<table><tbody>','</tbody></table>',2],
				th:td,
				td:td,
				col:['<table><colgroup>','</colgroup></table>',2],
				fieldset:['<form>','</form>',1],
				legend:['<form><fieldset>','</fieldset></form>',2],
				option:option,
				optgroup:option,
				script:noscope,
				style:noscope,
				link:noscope,
				param:noscope,
				base:noscope
			},
			tag=/^\s*<([^\s>]+)/.exec(html),
			el=document.createElement('div'),
			map=tag?tags[tag[1].toLowerCase()]:null,
			depth=map?map[2]+1:1;
		el.innerHTML=map?map[0]+html+map[1]:html;
		while(depth--){
			el=el.firstChild;
		}
		return $(el);
	};

	$.ender({

		/*
			Return a css property, set a css property or set a list of properties

			Parameters
				String, Object name
				String, undefined value

			Return
				String, Object
		*/
		css:function(name,value){
			var // Translate CSS name to JS syntax
				translateName=function(name){
					return name.replace(/-([a-z])/g,function(str,p1){
						return p1.toUpperCase();
					});
				},
				// Set a CSS property
				setStyle=function(els,name,value){
					name=translateName(name);
					for(var i=0,j=els.length;i<j;++i){
						if(name=='opacity'){
							try{els[i].filters['DXImageTransform.Microsoft.Alpha'].opacity=value*100;}
							catch(e){
								try{els[i].filters('alpha').opacity=value*100;}
								catch(e){els[i].style.opacity=value;}
							}
						}
						else{
							els[i].style[name]=value;
						}
					}
				},
				// Get a CSS property
				getStyle=function(el,name){
					name=translateName(name);
					if(name=='opacity'){
						try{return el.filters['DXImageTransform.Microsoft.Alpha'].opacity/100;}
						catch(e){
							try{return el.filters('alpha').opacity/100;}
							catch(e){return el.style.opacity;}
						}
					}
					return el.style[name];
				};
			if(typeof name=='string'){
				// Get a CSS property
				if(value===undefined){
					return getStyle(this[0],name);
				}
				// Set a CSS property
				else{
					setStyle(this,name,value);
					return this;
				}
			}
			// Set a list of CSS properties
			else if(typeof name=='object'){
				for(var i in name){
					setStyle(this,i,name[i]);
				}
				return this;
			}
		},

		/*
			Return or set html content

			Parameters
				String html

			Return
				String, Object
		*/
		html:function(html){
			// Get node's html
			if(html===undefined){
				if(this[0].nodeName=='IFRAME'){
					return this[0].src.substr(29);
				}
				else{
					return this[0].innerHTML;
				}
			}
			// Set node's html
			else{
				for(var i=0,j=this.length;i<j;++i){
					if(this[i].nodeName=='IFRAME'){
						this[i].src='data:text/html;charset=utf-8,'+encodeURI(html);
					}
					else{
						this[i].innerHTML=html;
					}
				}
				return this;
			}
		},

		/*
			Return or set text content

			Parameters
				String text

			Return
				String, Object
		*/
		text:function(text){
			// Get node's text
			if(text===undefined){
				return this[0].innerText!==undefined?
					this[0].innerText:
					this[0].textContent.replace(/^\s*(.+?)\s*$/,'$1');
			}
			// Set node's text
			else{
				for(var i=0,j=this.length;i<j;++i){
					if(this[i].innerText!==undefined){
						this[i].innerText=text;
					}
					else{
						this[i].textContent=text;
					}
				}
				return this;
			}
		},

		/*
			Return a an attribute or set one

			Parameters
				String, Object name
				String, undefined value

			Return
				Array, String, Object
		*/
		attr:function(name,value){
			var i,j,k;
			if(typeof name=='string'){
				// Get an attribute
				if(value===undefined){
					return this[0].getAttribute(name);
				}
				// Set an attribute
				else{
					for(i=0,j=this.length;i<j;++i){
						this[i].setAttribute(name,value);
					}
					return this;
				}
			}
			// Set a list of attributes
			else if(typeof name=='object'){
				for(k in name){
					for(i=0,j=this.length;i<j;++i){
						this[i].setAttribute(i,name[k]);
					}
				}
				return this;
			}
		},

		/*
			Return a list of data attributes, return one, set a list or one

			Parameters
				String, Object name
				String value

			Return
				Array, String, Object
		*/
		data:function(name,value){
			var i;
			// Get the data list
			if(name===undefined){
				var values={},
					attributes=this[0].attributes,
					i,j;
				for(i=0,j=attributes.length;i<j;++i){
					if(/^data-/i.test(attributes[i].name)){
						values[attributes[i].name.substring(5)]=attributes[i].value;
					}
				}
				return values;
			}
			// Set a list of data attributes
			else if(typeof name=='object'){
				for(i in name){
					this.attr('data-'+i,name[i]);
				}
			}
			// Get a data attribute
			else if(value===undefined){
				return this.attr('data-'+name);
			}
			// Set a data attribute
			else{
				this.attr('data-'+name,value);
			}
			return this;
		},

		/*
			Return a value or set one

			Parameters
				String value

			Return
				Array, String, Object
		*/
		val:function(value){
			// Return an input's value
			if(value===undefined){
				if(this[0].type=='checkbox'){
					return this[0].checked;
				}
				else{
					return this[0].value;
				}
			}
			// Set an input's value
			else{
				for(var i=0,j=this.length;i<j;++i){
					if(this[i].type=='checkbox'){
						this[i].checked=value;
					}
					else{
						this[i].value=value;
					}
				}
				return this;
			}
		},

		/*
			Append html contents

			Parameters
				Object, String node

			Return
				Object
		*/
		append:function(node){
			if(typeof node=='string'){
				node=$(node);
			}
			this[0].appendChild(node[0]);
			return this;
		},

		/*
			Prepend html contents

			Parameters
				Object, String node

			Return
				Object
		*/
		prepend:function(node){
			if(typeof node=='string'){
				node=$(node);
			}
			this[0].insertBefore(node[0],this.children()[0]);
			return this;
		},

		/*
			Add html contents before the current node

			Parameters
				Object, String node

			Return
				Object
		*/
		before:function(node){
			if(typeof node=='string'){
				node=$(node);
			}
			this.parent().insertBefore(node[0],this[0]);
			return this;
		},

		/*
			Add html contents after the current node

			Parameters
				Object, String node

			Return
				Object
		*/
		after:function(node){
			var next=this.next();
			if(next){
				return next.before(node);
			}
			else{
				return this.parent().append(node);
			}
		},

		/*
			Remove the current node
		*/
		remove:function(){
			for(var i=0,j=this.length;i<j;++i){
				$(this[i]).parent()[0].removeChild(this[i]);
			}
		},

		/*
			Return node's parent

			Return
				Object
		*/
		parent:function(){
			return $(this[0].parentNode);
		},

		/*
			Return node's previous node

			Return
				Object
		*/
		previous:function(){
			return $(this[0].previousSibling);
		},

		/*
			Return node's next node

			Return
				Object
		*/
		next:function(){
			var next=this[0].nextSibling;
			if(next){
				return $(next);
			}
			else{
				return null;
			}
		},

		/*
			Return node's children

			Return
				Array
		*/
		children:function(){
			return $(this[0].children);
		},

		/*
			Add a class to the current node

			Parameters
				String cls

			Return
				Object
		*/
		addClass:function(cls){
			for(var i=0,j=this.length;i<j;++i){
				this[i].className+=' '+cls;
			}
			return this;
		},

		/*
			Remove a class from the current node

			Parameters
				String cls

			Return
				Object
		*/
		removeClass:function(cls){
			for(var i=0,j=this.length;i<j;++i){
				this[i].className=this[i].className.replace(new RegExp('\\b ?'+cls+'\\b'),'');
			}
			return this;
		},

		/*
			Test if a class exists

			Parameters
				String cls

			Return
				Boolean
		*/
		hasClass:function(cls){
			var re=new RegExp('\\b'+cls+'\\b');
			return re.test(this[0].className);
		},

		/*
			Return width

			Return
				Number
		*/
		width:function(){
			if(this[0]===window){
				return html.clientWidth;
			}
			else if(this[0]===document || this[0]===html || this[0]===body){
				return Math.max(body.scrollWidth,body.offsetWidth,html.clientWidth,html.scrollWidth,html.offsetWidth);
			}
			else{
				return this[0].offsetWidth;
			}
		},

		/*
			Return height

			Return
				Number
		*/
		height:function(){
			if(this[0]===window){
				return html.clientHeight;
			}
			else if(this[0]===document || this[0]===html || this[0]===body){
				return Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);
			}
			else{
				return this[0].offsetHeight;
			}
		},

		/*
			Return top offset

			Return
				Number
		*/
		top:function(){
			return this[0].getBoundingClientRect().top+$('body')[0].scrollTop;
		},

		/*
			Return left offset

			Return
				Number
		*/
		left:function(){
			return this[0].getBoundingClientRect().left+$('body')[0].scrollLeft;
		},

		/*
			Clone

			Return
				Node
		*/
		clone:function(){
			return $(this[0].cloneNode(true));
		},

		/*
			Add a listener

			Parameters
				String event
				Function func

			Return
				Object
		*/
		on:function(event,func){
			event=event.split(' ');
			// Wrap callback
			func=function(node,func){
				return function(e){
					var propagate=!!func.apply(node,[e]);
					if(!propagate && e.preventDefault!==undefined){
						e.preventDefault();
					}
					return propagate;
				};
			}(this,func);
			// Plug each event
			for(var i=0,j=event.length;i<j;++i){
				for(var k=0,l=this.length;k<l;++k){
					if(this[k].addEventListener){
						this[k].addEventListener(event[i],func,false);
					}
					else{
						this[k].attachEvent('on'+event[i],func);
					}
				}
			}
			return this;
		},

		/*
			Set/get scrollTop

			Parameters
				Number value

			Return
				Number, Object
		*/
		scrollTop:function(value){
			if(this[0]===window || this[0]===document || this[0]===html || this[0]===body){
				if(value!==undefined){
					scrollElement().scrollTop=value;
					return this;
				}
				else{
					return scrollElement().scrollTop;
				}
			}
			else{
				if(value!==undefined){
					this[0].scrollTop=value;
					return this;
				}
				else{
					return this[0].scrollTop;
				}
			}
		},

		/*
			Set/get scrollLeft

			Parameters
				Number value

			Return
				Number, Object
		*/
		scrollLeft:function(value){
			if(this[0]===window || this[0]===document || this[0]===html || this[0]===body){
				if(value!==undefined){
					scrollElement().scrollLeft=value;
					return this;
				}
				else{
					return scrollElement().scrollLeft;
				}
			}
			else{
				if(value!==undefined){
					this[0].scrollLeft=value;
					return this;
				}
				else{
					return this[0].scrollLeft;
				}
			}
		}

	},true);

}());