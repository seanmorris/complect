import { Bag  } from 'curvature/base/Bag';
import { View } from 'curvature/base/View';

import { Styles } from '../stage/Styles';

import uuid from 'uuid';

export class Entity extends View
{
	constructor(args,stage)
	{
		super(args);

		this.args.type        = 'entity';
		this.preserve         = true;
		this.stage            = stage;

		this.template         = require('./entity.tmp');

		this.args.uuid        = args.uuid   || uuid();
		this.args.name        = args.name   || '_' + this.args.uuid;
		this.args.styles      = {};
		this.args.breakpoints = {};
		this.styleViews       = {};

		this.styleView        = new Styles;

		this.styleView.args.templateId = this.args.uuid;

		this.args._children = [];
		this.args.children  = new Bag((item, meta, change)=>{
			if(!change)
			{
				return;
			}

			this.args._children.length = 0;

			Object.assign(this.args._children, this.args.children.items());

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
			this.styleView.args.templateId = this.args.uuid;
		},{wait:0});

		this.args.states.bindTo((v,k) => {

			this.args._states = this.activeStates().join(' ');

		},{wait:0});

		this.args._styles = '';
		this.args._states = '';

		this.args.metaStates = {};

		this.args.metaStates.bindTo((v,k,t)=>{
			this.args._metaStates = Object.keys(t).filter(kk=>t[kk]).join(' ');
		}, {wait: 0});
	}

	addStyle(rule, value, states = [], breakpoint = null)
	{
		states = states.slice(0);

		states.sort();

		let selector = states.map(s=>`[data-state~="${s}"]`).join('');

		if(!this.args.styles)
		{
			this.args.styles = {};
		}

		if(!this.args.styles[selector])
		{
			this.args.styles[selector] = [];
		}

		this.args.styles[selector][rule] = value;

		this.args._styles              = this.compileStyles();
		this.styleView.args.content    = this.args._styles;
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
		return this.findTag(`#_${this.args._id}`);
	}

	stageAttached(stage, event)
	{
		let stageWindow   = stage.getWindow();
		let stageDocument = stageWindow.document
		let head          = stageDocument.querySelector('head');

		if(head)
		{
			this.styleView.render(head);
		}

		for(let i in this.args._children)
		{
			this.args._children[i].stageAttached(stage, event);
		}
	}

	remove()
	{
		let children = this.args.children.items();

		for(let i in children)
		{
			children[i].remove();
		}

		super.remove();
	}

	hover(event)
	{
		this.args.metaStates['hover'] = true;
	}

	unhover(event)
	{
		this.args.metaStates['hover'] = false;
	}

	click(event, uuid)
	{
		if(uuid !== this.args.uuid)
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

	export()
	{
		let styles = {};

		for(let  i in this.args.styles)
		{
			styles[i] = styles[i] || {};

			for(let j in this.args.styles[i])
			{
				styles[i][j] = this.args.styles[i][j];
			}
		}

		return {
			type:       this.args.type
			, uuid:     this.args.uuid
			, name:     this.args.name
			, styles:   styles
			, states:   this.args.states
			, children: this.args._children.map(c=>c.args.uuid)
		};
	}

	static import(skeleton, project)
	{
		let entity = new this({
			uuid:   skeleton.uuid
			, name: skeleton.name

		}, project.stage);

		entity.stage = project.stage;

		if(skeleton.styles)
		{
			for(let selector in skeleton.styles)
			{
				for(let property in skeleton.styles[selector])
				{
					let rule = skeleton.styles[selector][property];

					if(!entity.args.styles[selector])
					{
						entity.args.styles[selector] = {};
					}

					entity.args.styles[selector][property] = rule;

					console.log(selector, property, rule);
				}
			}
		}

		if(skeleton.children)
		{
			skeleton.children.map(childId => {
				let component = project.getComponent(childId);

				entity.args.children.add(component)
			});
		}

		if(skeleton.properties)
		{
			for(let property in skeleton.properties)
			{
				entity.args[ property ] = skeleton.properties[ property ];
			}
		}

		if(skeleton.states)
		{
			for(let i in skeleton.states)
			{
				console.log(i);

				entity.args.states[ i ] = skeleton.states[i];
			}
		}

		entity.args._styles           = entity.compileStyles();
		entity.styleView.args.content = entity.args._styles;

		return entity;
	}
}
