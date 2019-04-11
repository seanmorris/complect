import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

export class Stator extends View
{
	constructor(args)
	{
		super(args);

		this.template = require('./stator.tmp');

		this.args.states = [
			'default', 'active', 'inactive', 'hover'
		];

		this.args.form = null;

		let prevBind = false;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			let formSource = {"_method": "get"};

			for(let state in v.args.states)
			{
				formSource[state] =  {
					"name":  state,
					"title": state,
					"type": "checkbox",
					"value": v.args.states[state],
					"attrs": {
						"type": "checkbox",
						"name": state,
						"id":   state
					}
				};
			}

			if(prevBind)
			{
				prevBind();
			}

			this.args.form = new Form(formSource);

			prevBind = this.args.form.value.bindTo((vv,kk)=>{
				v.args.states[kk] = vv;
			});

			console.log();
		});
	}
}
