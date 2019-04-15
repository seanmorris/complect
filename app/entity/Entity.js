import { Bag  } from 'curvature/base/Bag';
import { View } from 'curvature/base/View';

import { Styles } from '../stage/Styles';

export class Entity extends View
{
	constructor(args,stage)
	{
		// console.trace();
		super(args);
		this.type           = 'entity';
		this.preserve       = true;
		this.stage          = stage;

		this.template       = require('./entity.tmp');
		this.args.name      = this.args.name   || '_' + this.args._id;
		this.args.styles    = this.args.styles || {};

		this.styleView      = new Styles;

		this.styleView.args.templateId = this.args._id;

		this.args._children = [];
		this.args.children  = new Bag((item, meta, change)=>{
			if(!change)
			{
				return;
			}

			this.args._children = this.args.children.items();

			if(change > 0)
			{
				item.stage  = this.stage;
				item.parent = this;
			}
		});

		this.args.states = {
			// default:    false
			// , active:   false
			// , inactive: false
			// , hover:    false
		};

		this.args.bindTo('name', (v) => {
			let tag;

			if(!(tag = this.rootTag()))
			{
				return;
			}

			tag.setAttribute('class', v);

			this.args._styles              = this.compileStyles();
			this.styleView.args.content    = this.args._styles;
			this.styleView.args.templateId = this.args._id;
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

	postRender()
	{
		let stageWindow   = this.stage.getWindow();
		let stageDocument = stageWindow.document
		let head          = stageDocument.querySelector('head');

		if(head)
		{
			this.styleView.render(head);
		}
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

		this.args._styles              = this.compileStyles();
		this.styleView.args.content    = this.args._styles;

		// console.log(this.args._styles);

		// console.log(JSON.stringify(
		// 	this.project.export()
		// , null,4));
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

	// getAllStyles()
	// {
	// 	let styles = {};

	// 	styles[this.args._id] = this.compileStyles();

	// 	for(let i in this.args.children)
	// 	{
	// 		Object.assign(styles, this.args.children[i].compileStyles());
	// 	}

	// 	return styles;
	// }

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

	import()
	{

	}

	export()
	{
		let styles = {};

		for(let  i in this.args.styles)
		{
			// styles[i] = this.args.styles[i];
			styles[i] = styles[i] || {};

			for(let j in this.args.styles[i])
			{
				styles[i][j] = this.args.styles[i][j];
			}
		}

		// console.log( JSON.stringify(this.args._children.map(c=>c.export())) );

		return {
			type:       this.type
			, id:       this.args._id
			, name:     this.args.name
			, styles:   styles
			, states:   this.args.states
			, children: this.args._children.map(c=>c.args.name)
		};
	}
}
