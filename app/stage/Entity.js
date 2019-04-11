import { Bag  } from 'curvature/base/Bag';
import { View } from 'curvature/base/View';

export class Entity extends View
{
	constructor(args)
	{
		super(args);
		this.type           = 'base entity';
		this.preserve       = true;

		this.template       = require('./entity.tmp');
		this.args.name      = this.args.name   || '';
		this.args.styles    = this.args.styles || {};
		this.args._children = [];
		this.args.children  = new Bag((item, meta, change)=>{
			if(!change)
			{
				return;
			}

			this.args._children = this.args.children.items();
		});

		this.args.states = this.args.states || {
			default:    false
			, active:   false
			, inactive: false
			, hover:    false
		};

		this.args.bindTo('name', (v) => {
			let tag;

			if(!(tag = this.rootTag()))
			{
				return;
			}

			tag.setAttribute('class', v);

			this.args._styles = this.compileStyles();
		},{wait:0});

		this.args.states.bindTo((v,k) => {
			this.args._states = this.activeStates().join(' ');

			// console.log(this.args._states);
		},{wait:0});

		this.args._styles = '';
		this.args._states = '';

		this.args.metaStates = {};

		this.args.metaStates.bindTo((v,k,t)=>{
			this.args._metaStates = Object.keys(t).filter(kk=>t[kk]).join(' ');
		}, {wait: 0});
	}

	addStyle(rule, value, states = [])
	{
		states = states.slice(0);

		states.sort();

		let selector = states.map(s=>`[data-state~="${s}"]`).join('');

		if(!this.args.styles[selector])
		{
			this.args.styles[selector] = [];
		}

		this.args.styles[selector][rule] = value;

		this.args._styles = this.compileStyles();
	}

	compileStyles()
	{
		return Object.keys(this.args.styles).map(selector => {

			let rules = Object.keys(this.args.styles[selector]).map((k)=>{

				if(this.args.styles[selector][k] == '')
				{
					return;
				}

				return `${k}:${this.args.styles[selector][k]}; `;

			}).join('');

			return `.${this.args.name}${selector}{${rules}} `;

		}).join('');
	}

	compileTemplate()
	{
		return this.rootTag().outerHTML;
	}

	activeStates()
	{
		return Object.keys(this.args.states).filter((kk)=>{
			return this.args.states[kk];
		});
	}

	rootTag()
	{
		return this.findTag(`#_${this._id}`);
	}

	findTag(selector)
	{
		for(let i in this.nodes)
		{
			let result;

			if(!this.nodes[i].querySelector)
			{
				continue;
			}

			if(this.nodes[i].matches(selector))
			{
				return this.nodes[i];
			}

			if(result = this.nodes[i].querySelector(selector))
			{
				return result;
			}
		}
	}

	hover(event)
	{
		this.args.metaStates['hover'] = true;
	}

	unhover(event)
	{
		this.args.metaStates['hover'] = false;
	}

	click(event, _id)
	{
		if(_id !== this.args._id)
		{
			return;
		}

		event.stopPropagation();

		this.focus();
	}

	focus()
	{
		this.args.metaStates['click'] = true;
		this.stage.focus(this);
	}

	blur()
	{
		this.args.metaStates['click'] = false;
	}
}
