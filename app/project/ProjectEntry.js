import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

import { Toolbar } from './Toolbar';
import { Project } from './Project';

export class ProjectEntry extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./projectEntry.tmp');
		this.toolbar  = new Toolbar({main: this});
		this.prevBind = null;

		this.buildForm();
	}

	buildForm()
	{
		let formSource = {"_method": "get"};

		formSource.name =  {
			"name":  'project-name',
			"title": 'name',
			"type":  'text',
			"value": '',
			"attrs": {
				"type": 'text',
				"name": 'project-name',
				"id":   'project-name',

				"placeholder": 'untitled',
				'tab-index':    0,
			}
		};

		formSource.buttons =  {
			"name":  'buttons',
			"title": '',
			"type":  'fieldset',
			"value": '',
			"children": {},
			"attrs": {
				"type": 'fieldset',
				"name": 'buttons',
				"id":   'project-buttons',
			}
		};

		formSource.buttons.children.dump =  {
			"name":  'dump',
			"title": '☷ dump',
			"type":  'button',
			"value": '',
			"attrs": {
				"type": 'button',
				"name": 'dump',
				"id":   'dump',
				"cv-on": 'click:click(event)',

				'tab-index': 0,
			}
		};

		formSource.buttons.children.save =  {
			"name":  'save',
			"title": '🖫 save',
			"type":  'button',
			"value": '',
			"attrs": {
				"type": 'button',
				"name": 'save',
				"id":   'save',
				"cv-on": 'click:click(event)',

				'tab-index': 0,
			}
		};

		formSource.buttons.children.load =  {
			"name":  'load',
			"title": '🗀 load',
			"type":  'button',
			"value": '',
			"attrs": {
				"type": 'button',
				"name": 'load',
				"id":   'project-load',
				"cv-on": 'click:click(event)',
				'tab-index': 0,
			}
		};

		// formSource.buttons.children.build =  {
		// 	"name":  'build',
		// 	"title": '࿊ build',
		// 	"type":  'button',
		// 	"value": '',
		// 	"attrs": {
		// 		"type": 'button',
		// 		"name": 'build',
		// 		"id":   'project-build',
		// 		// "cv-on": 'click:click(event)',
		// 		// 'tab-index': 0,
		// 	}
		// };

		formSource.buttons.children.export =  {
			name:  'build',
			title: '⌬ build',
			type:  'button',
			value: '',
			attrs: {
				type: 'button',
				name: 'build',
				id:   'project-build',
				// "cv-on": 'click:click(event)',
				// 'tab-index': 0,
			}
		};

		this.args.form = new Form(formSource);

		this.args.form.fields.buttons.fields.save.click = ()=>{
			
			this.saveProject();
			
		};

		this.args.form.fields.buttons.fields.dump.click = ()=>{
			
			this.dumpProject();
			
		};

		this.args.form.fields.buttons.fields.load.click = ()=>{
			
			this.openProject();
			
		};

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((v,k)=>{
			if(!this.args.project)
			{
				return;
			}

			if(k === 'name')
			{
				this.args.project.name = v;
			}
		});
	}

	saveProject()
	{
		let projectSource = JSON.stringify(this.args.project.export(), null, 4);
		let encodedSource = encodeURIComponent(projectSource);

		let link      = document.createElement('a');

		link.download = `${this.args.project.name || 'untitled-complect-project'}.cpj`;
		link.target   = '_blank';
		link.href     = `data:application/json;charset=utf-8,${encodedSource}`;

		link.click();
	}

	dumpProject()
	{
		let projectSource = JSON.stringify(this.args.project.export(), null, 4);
		let encodedSource = encodeURIComponent(projectSource);

		let popup = window.open(
			'about:blank'
			// , ''
			// , 'chrome=no,location=no'
		);

		let iconLink  = popup.document.createElement('link');
		iconLink.type = 'image/x-icon';
		iconLink.rel  = 'shortcut icon';
		iconLink.href = 'http://' + location.host + '/favicon.ico';

		popup.document.write(`<iframe
				src         = 'data:application/json;charset=utf-8,${encodedSource}'
				frameborder = '0'
				style       = '
					position: absolute;
					top:      0px;
					left:     0px;
					width:    100%;
					height:   100%;
					border:   0;
				'
				allowfullscreen
		>`);

		popup.document.getElementsByTagName('head')[0].appendChild(iconLink);

		window.addEventListener('unload', () => {
			popup.close();
		});
	}

	openProject()
	{
		let input = document.createElement('input');

		let opened = (event) => {
			input.removeEventListener('change', opened);

			let reader = new FileReader();
			
			let readFile = (event) => {
				reader.removeEventListener('load', readFile);

				let source   = reader.result;
				let skeleton = JSON.parse(source);

				let project = Project.import(skeleton, this.stage)

				this.triptych.args.project = project;
			};

			reader.addEventListener('load', readFile);
			
			reader.readAsText(input.files[0]);
		};

		input.addEventListener('change', opened);

		input.setAttribute('type',   'file');
		input.setAttribute('accept', '.cpj');
		input.click();
	}
}
