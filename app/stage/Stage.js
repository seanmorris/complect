import { View   } from 'curvature/base/View';
import { Entity } from '../entity/Entity';

export class Stage extends View
{
	constructor(args)
	{
		super(args);

		this.args.rootEntity = this.args.rootEntity || null;
		this.template        = require('./stage.tmp');
		this.focused         = null;

		this.args.styles     = {};

		this.args.bindTo('rootEntity', (v) => {
			if(!v)
			{
				return;
			}

			v.stage = this;
		});

		this._attached = false;

		this.resizeListener = (event) =>{
			let _window = event.target;
			console.log(_window.innerWidth, _window.innerHeight);
		}
	}

	getTemplate()
	{
		return this.args.rootEntity.compileTemplate();
	}

	getStyle()
	{
		return this.args.rootEntity.compileStyles();
	}

	focus(entity)
	{
		if(this.focused)
		{
			this.focused.blur();

			if(this.focused === entity)
			{
				entity.blur();
				this.focused = null;
				return;
			}
		}

		this.focused = entity;

		this.args.triptych.focus(entity);
	}

	getWindow()
	{
		if(!this.tags.stage)
		{
			return;
		}

		return this.tags.stage.element.contentWindow;
	}

	attached(event)
	{
		if(this._attached)
		{
			return;
		}

		let _window = this.getWindow();

		if(_window)
		{
			_window.addEventListener('resize', this.resizeListener);

			this.cleanup.push(()=>{
				_window.removeEventListener('resize', this.resizeListener);				
			});

			let _document = _window.document;

			let _html   = _document.querySelector('html');
			let _body   = _document.querySelector('body');
			let subDoc  = _html.parentNode;

			_html.parentNode.removeChild(_html);

			this.args.rootEntity.render(subDoc);

			this.args.styles.bindTo((v,k) => {
				console.log(k,v);
				if(!this.args.rootEntity)
				{
					return;
				}
				this.args.rootEntity.args.styles[k] = v;
			});

			this._attached = true;
		}

	}
}
