import { View } from 'curvature/base/View';

export class Entity extends View
{
	constructor(args)
	{
		super(args);
		this.args.name   = this.args.name   || '';

		this.args.states = this.args.states || {
			default:    false
			, active:   false
			, inactive: false
			, hover:    false
		};

		this.args.styles = this.args.styles || {};

		this.template    = require('./entity.tmp');

		this.args.bindTo('name', (v) => {
			if(!this.tags.entity)
			{
				return;
			}

			let tag = this.tags.entity.element;

			tag.setAttribute('class', v);

			this.args._styles = this.compileStyles();
		},{wait:0});

		this.args.states.bindTo((v,k) => {
			this.args._states = this.activeStates().join(' ');

			// console.log(this.args._states);
		},{wait:0});

		this.args._styles = '';
		this.args._states = '';
	}

	addStyle(rule, value, states = [])
	{
		states = states.slice(0);

		states.sort();

		let stateSelector = states.map(s=>`[data-state~="${s}"]`).join('');

		let selector      = `${stateSelector}`;

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
		return this.tags.entity.element.outerHTML;
	}

	activeStates()
	{
		return Object.keys(this.args.states).filter((kk)=>{
			return this.args.states[kk];
		});
	}
}
