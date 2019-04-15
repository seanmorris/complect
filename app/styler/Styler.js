import { Config  } from 'Config';
import { View    } from 'curvature/base/View';
import { Form    } from 'curvature/form/Form';
import { Toolbar } from './Toolbar';

export class Styler extends View
{
	constructor(args)
	{
		super(args);

		this.stage    = null;
		this.project  = null;
		this.template = require('./styler.tmp');
		this.toolbar  = new Toolbar({main: this});

		this.args.styles = {};
		this.args.states = [];
		this.args.focus  = null;
		this.args.stage  = null;
		this.args.status = 'all states';
		this.args.search = null;
		this.prevDebind  = null;

		this.args.bindTo('filter', (v, k) => {
			if(!this.args.focus)
			{
				return;
			}

			if(!this.args.focus.rootTag())
			{
				return;
			}

			this.reloadForm();

		}, {wait: 0});

		this.args.bindTo('search', (v, k) => {
			if(!this.args.focus)
			{
				return;
			}

			if(!this.args.focus.rootTag())
			{
				return;
			}

			this.reloadForm();
		}, {wait: 0});
	}

	postRender()
	{
		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			let rootTag = v.rootTag();

			if(!rootTag)
			{
				return;
			}

			let styles = getComputedStyle(v.rootTag());

			this.reloadForm(styles);

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
					this.args.form.value[k] = styles[k];
					this.args.styles[k]     = styles[k];
				});
			}
		});
	}

	reloadForm()
	{
		let formSource = {"_method": "get"};

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

		let styles = getComputedStyle(this.args.focus.rootTag());

		let configFilters;

		if(configFilters = Config.styleFilters[ this.args.filter ])
		{
			filteredStyles = configFilters;
		}
		else
		{
			filteredStyles = {};

			for(let i = 0; i < styles.length; i++)
			{
				filteredStyles[ styles.item( i ) ] = null;
			}
		}

		let filter = this.args.search;

		for(let i in filteredStyles)
		{
			this.args.styles[i] = styles.getPropertyValue(i);

			let rule = i;

			if(filter && !rule.match(new RegExp(filter)))
			{
				console.log(filter);
				continue;
			}

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

		if(this.prevDebind)
		{
			this.prevDebind();
		}

		let styleDebind = this.args.form.value.bindTo((v,k) => {
			this.args.styles[k] = v;
		});

		let stateDebind = this.args.focus.args.states.bindTo((vv, kk, tt)=>{
			if(!this.args.focus)
			{
				return;
			}

			this.args.states = this.args.focus.activeStates();
			this.args.status = this.args.states.map(x=>`+${x}`).join(' ');

			if(!this.args.status)
			{
				this.args.status = 'all states';
			}

		}, {wait: 0});

		this.prevDebind = () => {
			stateDebind();
			styleDebind();
		};
	}
}
