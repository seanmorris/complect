import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';
import { Toolbar } from './Toolbar';

export class Stator extends View
{
	constructor(args)
	{
		super(args);

		this.template = require('./stator.tmp');
		this.toolbar  = new Toolbar({main: this});

		this.args.states = [];

		this.args.form = null;
		this.args.newState = null;

		this.prevBind = false;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			this.buildForm(v);


		});
	}

	buildForm(entity)
	{
		let formSource = {"_method": "get"};

		for(let state in entity.args.states)
		{
			formSource[state] =  {
				"name":  state,
				"title": state,
				"type": "checkbox",
				"value": entity.args.states[state],
				"attrs": {
					"type": "checkbox",
					"name": state,
					"id":   state
				}
			};
		}

		this.args.form = new Form(formSource);

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((vv,kk)=>{
			entity.args.states[kk] = vv;
		});

		this.args.states = Object.keys(entity.args.states);
	}

	add(newState)
	{
		if(!this.args.focus)
		{
			return;
		}

		if(this.args.focus.args.states[newState])
		{
			return;
		}

		this.args.focus.args.states[newState] = false;

		this.buildForm(this.args.focus);

		this.args.newState = null;
	}
}
