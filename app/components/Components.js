import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

import { Toolbar } from './Toolbar';

export class Components extends View
{
	constructor(args)
	{
		super(args);
		this.template   = require('./components.tmp');
		// this.toolbar    = new Toolbar({main: this});
		this.prevBind   = null;

		this.components = [];

		this.projectDebind = () => {};
		
		this.args.bindTo('project', (v) => {
			if(!v)
			{
				return;
			}

			let templateDebind = v.bindTo('_currentTemplate', (vv,kk,tt) => {
				// this.currentTemplate = vv;

				if(!vv || !this.args.form)
				{
					return;
				}

				// console.log(vv);
			});

			let componentsDebind = v.components.bindTo((vv,kk,tt) => {
				// console.log(vv);
				if(!vv)
				{
					return;
				}
				
				this.components[ vv.args.name ] = vv.args.name;

				this.buildForm();
			});

			for(let i in v.components)
			{
				this.components[ i ] = i;
			}

			this.projectDebind();

			this.projectDebind = () => {
				templateDebind();
				componentsDebind();
			};
		});
	}

	buildForm()
	{
		let formSource = {"_method": "get"};

		let size = Object.keys(this.components).length;

		if(size < 3)
		{
			size = 3;
		}

		formSource.children = {
			"name":  'children',
			"title": '',
			"type":  'select',
			"value": null,
			"options": this.components,
			"attrs": {
				"type":     'select',
				"name":     'children',
				"id":       'builder-children',
				"size":     size, 
				"multiple": null,
				// "cv-on":    'click:childClicked(event)'
			}
		};

		this.args.form = new Form(formSource);

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((v,k)=>{
			
		});
	}
}
