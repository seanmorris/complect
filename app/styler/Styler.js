import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

export class Styler extends View
{
	constructor(args)
	{
		super(args);

		this.template    = require('./styler.tmp');
		this.args.styles = {};
		this.args.states = [];
		this.args.focus  = null;
		this.args.status = null;
	}

	postRender()
	{
		let prevDebind = null;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			let styles = getComputedStyle(v.rootTag());

			let filteredStyles = {
				display:      null
				, width:      'auto'
				, height:     'auto'
				, padding:    null
				, margin:     null
				, border:     null
				, color:      null
				, background: null
				, flex:       null

				, 'flex-direction':  null
				, 'align-items':     null
				, 'justify-content': null

				, 'box-sizing':   null

				, 'font-family': null
				, 'font-weight': null
				, 'font-size':   null
				, 'transition':  null
				, 'transform':   null
				, 'opacity':     null
			};

			let formSource = {"_method": "get"};

			for(let i in filteredStyles)
			{
				this.args.styles[i] = styles.getPropertyValue(i);

				let rule = i;

				formSource[rule] =  {
					"name":  rule,
					"title": rule,
					"type": "text",
					"value": styles.getPropertyValue(i),
					"attrs": {
						"type": "text",
						"name": rule,
						"id":   rule
					}
				};
			}

			this.args.form = new Form(formSource);

			let styleDebind = this.args.form.value.bindTo((v,k) => {
				// console.log(k,v);
				this.args.styles[k] = v;
			});

			let stateDebind = v.args.states.bindTo((vv, kk, tt)=>{
				if(!v)
				{
					return;
				}

				this.args.states = v.activeStates();
				this.args.status = this.args.states.map(x=>`+${x}`).join(' ');

				if(!this.args.status)
				{
					this.args.status = 'all states';
				}

			}, {wait: 0});

			if(prevDebind)
			{
				prevDebind();
			}

			prevDebind = () => {
				stateDebind();
				styleDebind();
			};
		}, {wait: 0});

		this.args.styles.bindTo((v,k,t) => {
			if(!this.args.focus)
			{
				return;
			}

			let styles    = getComputedStyle(this.args.focus.rootTag());
			let preValue  = styles.getPropertyValue(k);

			let entity    = this.args.focus;
			let entityTag = entity.rootTag();

			if(v !== preValue || !v)
			{
				entity.addStyle(k, v, this.args.states);
			}

			if(!v)
			{
				this.onTimeout(0, ()=>{
					// this.tags.style[k].element.value = styles[k];
					this.args.styles[k]              = styles[k];
				});
			}
		});
	}
}
