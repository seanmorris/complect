import { View  } from 'curvature/base/View';
import { Form  } from 'curvature/form/Form';
import { Label } from '../entity/Label'
import { Image } from '../entity/Image'

export class Properties extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./properties.tmp');

		this.args.className = '';

		let focusDebind = ()=>{};

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			let formSource = {"_method": "get"};

			formSource.name =  {
				"name":  'name',
				"title": 'name',
				"type": "text",
				"value": v.args.name,
				"attrs": {
					"type": "text",
					"name": 'name',
					"id":   'name'
				}
			};

			if(v instanceof Label)
			{
				formSource.content =  {
					"name":  'content',
					"title": 'content',
					"type": "text",
					"value": v.args.content,
					"attrs": {
						"type": "text",
						"name": 'content',
						"id":   'content'
					}
				};
			}

			if(v instanceof Image)
			{
				formSource.src =  {
					"name":  'src',
					"title": 'src',
					"type": "text",
					"value": v.args.src,
					"attrs": {
						"type": "text",
						"name": 'src',
						"id":   'src'
					}
				};
			}

			this.args.form = new Form(formSource);

			focusDebind();

			let nameDebind = this.args.form.value.bindTo('name', (v)=>{
				if(!this.args.focus)
				{
					return;
				}

				this.args.focus.args.name = v;
			});

			let contentDebind = this.args.form.value.bindTo('content', (v)=>{
				if(!this.args.focus)
				{
					return;
				}

				this.args.focus.args.content = v;
			});

			let srcDebind = this.args.form.value.bindTo('src', (v)=>{
				if(!this.args.focus)
				{
					return;
				}

				this.args.focus.args.src = v;
			});

			focusDebind = ()=>{
				nameDebind();
				contentDebind();
				srcDebind();
			};

			this.args.className = v.args.name;
		}, {wait: 0});
	}
}
