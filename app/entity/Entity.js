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
		this.args.styleViews  = {};

		this.args.styleViews.bindTo((v,k,d,t) => {

			let stageWindow   = this.stage.getWindow();

			console.log(this.stage);

			let stageDocument = stageWindow.document
			let head          = stageDocument.querySelector('head');

			if(head)
			{
				v.render(head);
			}

		});

		// this.styleView        = new Styles;
		// this.styleViews       = {};
		// this.styleView.args.templateId = this.args.uuid;

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

		this.args.states = {};

		this.args.bindTo('name', (v) => {
			let tag;

			if(!(tag = this.rootTag()))
			{
				return;
			}

			tag.setAttribute('class', v);

			// this.args._styles              = this.compileStyles();
			// this.styleView.args.content    = this.args._styles;
			// this.styleView.args.templateId = this.args.uuid;
		},{wait:0});

		this.args.states.bindTo((v,k) => {

			this.args._states = this.activeStates().join(' ');

		},{wait:0});

		// this.args._styles = '';
		this.args._states = '';

		this.args.metaStates = {};

		this.args.metaStates.bindTo((v,k,t)=>{
			this.args._metaStates = Object.keys(t).filter(kk=>t[kk]).join(' ');
		}, {wait: 0});

		this.args.stageAttached = false;
	}

	addStyle(rule, value, states = [], breakpoint)
	{
		states = states.slice(0);

		states.sort();

		let selector   = states.map(s=>`[data-state~="${s}"]`).join('');

		if(!this.args.styles)
		{
			this.args.styles = {};
		}

		breakpoint = breakpoint ? breakpoint : '';

		if(!this.args.styles[breakpoint])
		{
			this.args.styles[breakpoint] = [];
		}

		if(!this.args.styles[breakpoint][selector])
		{
			this.args.styles[breakpoint][selector] = [];
		}

		this.args.styles[breakpoint][selector][rule] = value;

		if(!this.args.styleViews[breakpoint])
		{
			this.args.styleViews[breakpoint] = new Styles({
				breakpoint, templateId: this.args.uuid
			});
		}

		this.args.styleViews[breakpoint].args.content = this.compileStyles(breakpoint);
	}

	compileStyles(breakpoint)
	{
		if(!this.args.styles[breakpoint])
		{
			return '';
		}

		return Object.keys(this.args.styles[breakpoint]).map(selector => {

			let rules = Object.keys(this.args.styles[breakpoint][selector]).map((k)=>{

				if(this.args.styles[breakpoint][selector][k] == '')
				{
					return;
				}

				return `${k}:${this.args.styles[breakpoint][selector][k]}; `;

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
			// this.styleView.render(head);
			for(let breakpoint in this.args.styleViews)
			{
				this.args.styleViews[breakpoint].render(head);
			}
		}

		for(let i in this.args._children)
		{
			this.args._children[i].stageAttached(stage, event);
		}

		this.args.stageAttached = true;
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

		for(let breakpoint in this.args.styles)
		{
			styles[breakpoint] = styles[breakpoint] || {};

			for(let selector in this.args.styles[breakpoint])
			{
				styles[breakpoint][selector] = styles[breakpoint][selector] || {};

				for(let property in this.args.styles[breakpoint][selector])
				{
					styles[breakpoint][selector][property]
						= this.args.styles[breakpoint][selector][property];
				}
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
			for(let breakpoint in skeleton.styles)
			{
				for(let selector in skeleton.styles[breakpoint])
				{
					for(let property in skeleton.styles[breakpoint][selector])
					{
						let rule = skeleton.styles[breakpoint][selector][property];

						if(!entity.args.styles)
						{
							entity.args.styles = {};
						}

						if(!entity.args.styles[breakpoint])
						{
							entity.args.styles[breakpoint] = {};
						}

						if(!entity.args.styles[breakpoint][selector])
						{
							entity.args.styles[breakpoint][selector] = {};
						}

						entity.args.styles[breakpoint][selector][property] = rule;

						if(1||!entity.args.styleViews[breakpoint])
						{
							entity.args.styleViews[breakpoint] = new Styles({
								breakpoint, templateId: entity.args.uuid
							});
						}

						entity.args.styleViews[breakpoint].args.content = entity.compileStyles(breakpoint);

						console.log(entity.args.styleViews[breakpoint].args.content);

						// console.log(breakpoint, selector, property, rule);

						// entity.addStyle(selector, rule, );
					}
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

		// entity.args._styles           = entity.compileStyles();
		// entity.styleView.args.content = entity.args._styles;

		return entity;
	}
}
