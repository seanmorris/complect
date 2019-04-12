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

		let prevBind = false;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			this.buildForm(v);

			if(prevBind)
			{
				prevBind();
			}

			prevBind = this.args.form.value.bindTo((vv,kk)=>{
				v.args.states[kk] = vv;
			});

			console.log();
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
	}

	add(newState)
	{
		console.log(newState);

		if(!this.args.focus)
		{
			return;
		}

		this.args.focus.args.states[newState] = false;

		this.buildForm(this.args.focus);
	}
}
