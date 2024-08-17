from wtforms import BooleanField, StringField, SelectField, TextAreaField
from wtforms.widgets.core import html_params
from markupsafe import Markup
from wtforms.validators import ValidationError
import wtforms.widgets


# ****************************************************
# helpers
# *****************************************************

def kiosk_validate(form):
    """

    :param form: wtform
    :return: empty list if validation was ok or list of errors.
    """
    errors = []
    if not form.validate():
        for fieldName, errorMessage in form.errors.items():
            errors += errorMessage
    return errors


# ****************************************************
# validators
# *****************************************************


def always_error(form, field):
    raise ValidationError('totally false')


def is_checked(form, field):
    if not field.data:
        raise ValidationError(field.label.text + " needs to be checked")


def kiosk_wtforms_field_init(f):
    ''' decorator for __init__ - constructors of Kiosk wtform fields
    that do not use the class decorator @kioskformfield. Makes sure, that the field's id will have
    css typical hyphens instead of the wtf underscores '''

    def wrapper(self, *args, **kwargs):
        if ("id" not in kwargs) and ("name" in kwargs):
            kwargs["id"] = kwargs["name"].replace("_", "-")
        return f(self, *args, **kwargs)

    return wrapper


def kiosk_wtforms_field(cls):
    ''' class-decorator for Kiosk wtform fields tha tmakes sure, that the field's id
        will have css typical hyphens instead of the wtf underscores.

        The implementation strikes me being ugly with the shadowing of the
        classes own __init__ constructor. But it seems to work.  Should I encounter the first side-effects,
        I will get rid of it.

        The decorated class must make sure to use the Python3 super() call to the super constructor and not
        the old fashioned super(cls, self), since cls would refer to the decorator function and not to the
        class itself. self.__class__ would work as well.
    '''

    def __init__(self, *args, **kwargs):
        if ("id" not in kwargs) and ("name" in kwargs):
            kwargs["id"] = kwargs["name"].replace("_", "-")

        if hasattr(self, '__original_init__'):
            self.__original_init__(*args, **kwargs)
        else:
            super(cls, self).__init__(*args, **kwargs)

    if hasattr(cls, '__init__'):
        setattr(cls, '__original_init__', getattr(cls, '__init__'))
    setattr(cls, '__init__', __init__)

    # return class_wrapper
    return cls


class KioskWtFormsFieldExtras:

    def init_kiosk_field(self, args, kwargs):
        if "class_" in kwargs:
            setattr(self, "css_class", kwargs.pop("class_"))

        if "errclass" in kwargs:
            setattr(self, "errclass", kwargs.pop("errclass"))

        if "labelclass" in kwargs:
            setattr(self, "labelclass", kwargs.pop("labelclass"))


# def kiosk_wtforms_widget(cls):
#     '''
#     '''
#
#     def __call__(self, field, **kwargs):
#
#         if field.errors and 'errclass' in kwargs:
#             if 'class' not in kwargs:
#                 kwargs['class'] = ''
#             kwargs['class'] = kwargs['class'] + " " + kwargs['errclass']
#
#         if hasattr(self, '__original_call__'):
#             return self.__original_call__(field, **kwargs)
#         else:
#             return super(cls, self).__call__(field, **kwargs)
#
#     if hasattr(cls, '__call__'):
#         setattr(cls, '__original_call__', getattr(cls, '__call__'))
#     setattr(cls, '__call__', __call__)
#
#     # return class_wrapper
#     return cls

def kiosk_wtforms_widget(cls):
    '''
    '''

    class class_wrapper:
        def __init__(self, *args, **kwargs):
            self.wrapped = cls(*args, **kwargs)

        def __call__(self, field, **kwargs):

            if field.errors and 'errclass' in kwargs:
                if 'class' not in kwargs:
                    kwargs['class'] = ''
                kwargs['class'] = kwargs['class'] + " " + kwargs['errclass']
            else:
                if field.errors and hasattr(field, "errclass"):
                    if 'class' not in kwargs:
                        kwargs['class'] = getattr(field, "errclass")
                    else:
                        kwargs['class'] = kwargs['class'] + " " + getattr(field, "errclass")

            if hasattr(field, "css_class"):
                if 'class' not in kwargs:
                    kwargs['class'] = getattr(field, "css_class")
                else:
                    kwargs['class'] = kwargs['class'] + " " + getattr(field, "css_class")

            if hasattr(field, "labelclass"):
                if 'labelclass' not in kwargs:
                    kwargs['labelclass'] = getattr(field, "labelclass")

            if field.label:
                field.label.text = field.label.text.replace("_", "-")

            return self.wrapped(field, **kwargs)

    return class_wrapper


@kiosk_wtforms_widget
class KioskStringFieldWidget(wtforms.widgets.TextInput):
    """
    The ordinary StringField, just with the decorated error behaviour
    """
    pass


@kiosk_wtforms_widget
class KioskLabeledPrettyCheckboxFieldWidget(wtforms.widgets.Input):
    """
    Render a basic checkbox field with a label

    """
    html_params = staticmethod(html_params)

    input_type = 'checkbox'

    def __call__(self, field, **kwargs):

        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)

        if getattr(field, 'checked', field.data):
            kwargs['checked'] = True

        if field.label.text:
            label_text = field.label.text
        else:
            label_text = field.name

        label_kwargs = {'for': field.id}
        state_kwargs = {"class": "state"}
        if 'labelclass' in kwargs:
            state_kwargs['class'] = 'state ' + kwargs.pop('labelclass')
            # kwargs = {key: kwargs[key] for key in kwargs.keys() if key != 'labelclass'}

        icon_kwargs = {"class": "icon mdi mdi-check"}
        if 'iconclass' in kwargs:
            icon_kwargs['class'] = "icon " + kwargs.pop('iconclass')
            # kwargs = {key: kwargs[key] for key in kwargs.keys() if key != 'labelclass'}

        shape_kwargs = {"class": "pretty p-icon p-curve p-thick p-plain p-smooth"}
        if 'shapeclass' in kwargs:
            shape_kwargs['class'] = "pretty " + kwargs.pop('shapeclass')
            # kwargs = {key: kwargs[key] for key in kwargs.keys() if key != 'labelclass'}

        if field.errors and 'errclass' in kwargs:
            if 'class' not in label_kwargs:
                label_kwargs['class'] = kwargs['errclass']
            else:
                label_kwargs['class'] = label_kwargs['class'] + " " + kwargs['errclass']
        class_attr = kwargs.pop("class")
        return Markup(f'<div {self.html_params(**shape_kwargs)}>'
                      f'<input {self.html_params(name=field.name, **kwargs)}/>'
                      f'<div {self.html_params(**state_kwargs)}>'
                      f'<i {self.html_params(**icon_kwargs)}></i>'
                      f'<label {self.html_params(**label_kwargs)}>'
                      f'{label_text}</label>'
                      f'</div>'
                      f'</div>'
                      )


@kiosk_wtforms_widget
class KioskLabeledBooleanFieldWidget(wtforms.widgets.Input):
    """
    Render a basic checkbox field with a label

    """
    html_params = staticmethod(html_params)

    input_type = 'checkbox'

    def __call__(self, field, **kwargs):

        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)

        if getattr(field, 'checked', field.data):
            kwargs['checked'] = True

        # if field.data:
        #     kwargs['checked'] = True
        # else:
        #     kwargs['checked'] = False

        if field.label.text:
            label_text = field.label.text
        else:
            label_text = field.name

        label_kwargs = {'for': field.id}
        if 'labelclass' in kwargs:
            label_kwargs['class'] = kwargs.pop('labelclass')
            # kwargs = {key: kwargs[key] for key in kwargs.keys() if key != 'labelclass'}

        if field.errors and 'errclass' in kwargs:
            if 'class' not in label_kwargs:
                label_kwargs['class'] = kwargs['errclass']
            else:
                label_kwargs['class'] = label_kwargs['class'] + " " + kwargs['errclass']

        return Markup(f'<label {self.html_params(**label_kwargs)}>'
                      f'<input {self.html_params(name=field.name, **kwargs)}>'
                      f'{label_text}</label>')


@kiosk_wtforms_widget
class KioskLabeledStringFieldWidget(wtforms.widgets.Input, KioskWtFormsFieldExtras):
    html_params = staticmethod(html_params)

    input_type = 'text'

    def __call__(self, field, **kwargs):

        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)

        if field.label.text:
            label_text = field.label.text
        else:
            label_text = field.name

        label_kwargs = {'for': field.id}
        if 'labelclass' in kwargs:
            label_kwargs['class'] = kwargs.pop('labelclass')

        if field.errors and 'errclass' in kwargs:
            if 'class' not in label_kwargs:
                label_kwargs['class'] = kwargs['errclass']
            else:
                label_kwargs['class'] = label_kwargs['class'] + " " + kwargs['errclass']

        super_markup = super().__call__(field, **kwargs)
        m2 = Markup(f'<label {self.html_params(**label_kwargs)}>'
                    f'{label_text}</label>') + super_markup

        return m2


@kiosk_wtforms_widget
class KioskLabeledTextAreaFieldWidget(wtforms.widgets.TextArea, KioskWtFormsFieldExtras):
    html_params = staticmethod(html_params)

    input_type = 'text'

    def __call__(self, field, **kwargs):

        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)

        if field.label.text:
            label_text = field.label.text
        else:
            label_text = field.name

        label_kwargs = {'for': field.id}
        if 'labelclass' in kwargs:
            label_kwargs['class'] = kwargs.pop('labelclass')

        if field.errors and 'errclass' in kwargs:
            if 'class' not in label_kwargs:
                label_kwargs['class'] = kwargs['errclass']
            else:
                label_kwargs['class'] = label_kwargs['class'] + " " + kwargs['errclass']

        markup_super = super().__call__(field, **kwargs)

        return Markup(f'<label {self.html_params(**label_kwargs)}>'
                      f'{label_text}</label>') + markup_super


@kiosk_wtforms_widget
class KioskLabeledSelectFieldWidget(wtforms.widgets.Select, KioskWtFormsFieldExtras):
    html_params = staticmethod(html_params)

    input_type = 'text'

    def __call__(self, field, **kwargs):

        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)

        if field.label.text:
            label_text = field.label.text
        else:
            label_text = field.name

        label_kwargs = {'for': field.id}
        if 'labelclass' in kwargs:
            label_kwargs['class'] = kwargs.pop('labelclass')

        if field.errors and 'errclass' in kwargs:
            if 'class' not in label_kwargs:
                label_kwargs['class'] = kwargs['errclass']
            else:
                label_kwargs['class'] = label_kwargs['class'] + " " + kwargs['errclass']

        markup_super = super().__call__(field, **kwargs)

        return Markup(f'<label {self.html_params(**label_kwargs)}>'
                      f'{label_text}</label>') + markup_super


@kiosk_wtforms_widget
class KioskTimeZoneSelectorFieldWidget(wtforms.widgets.Input, KioskWtFormsFieldExtras):
    """
    Render a kiosk-tz-combo-box field with a label

    """
    html_params = staticmethod(html_params)

    input_type = 'text'

    def __call__(self, field, **kwargs):

        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)
        kwargs.setdefault('value', field.data)

        if field.label.text:
            label_text = field.label.text
        else:
            label_text = field.name

        label_kwargs = {'for': field.id}
        if 'labelclass' in kwargs:
            label_kwargs['class'] = kwargs.pop('labelclass')
            # kwargs = {key: kwargs[key] for key in kwargs.keys() if key != 'labelclass'}

        if field.errors and 'errclass' in kwargs:
            if 'class' not in label_kwargs:
                label_kwargs['class'] = kwargs['errclass']
            else:
                label_kwargs['class'] = label_kwargs['class'] + " " + kwargs['errclass']

        rc = Markup(f'<label {self.html_params(**label_kwargs)}>{label_text}</label>'
                      f'<kiosk-tz-combo-box {self.html_params(name=field.name, **kwargs)}></kiosk-tz-combo-box>')
        return rc


@kiosk_wtforms_field
class KioskTimeZoneSelectorField(StringField, KioskWtFormsFieldExtras):
    widget = KioskTimeZoneSelectorFieldWidget()

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_widget
class KioskDateTimeTzFieldWidget(wtforms.widgets.TextInput):
    """
    An ordinary StringField, but with data-utc-date and data-tz instead of value
    """

    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)
        kwargs["data-utc-date"] = field.data
        kwargs["value"] = ""

        markup_super = super().__call__(field, **kwargs)
        return markup_super


@kiosk_wtforms_field
class KioskDateTimeTzField(StringField, KioskWtFormsFieldExtras):
    widget = KioskDateTimeTzFieldWidget()

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_widget
class KioskTzFieldWidget(wtforms.widgets.HiddenInput):
    """
    An ordinary hidden input field with an additional attribute "data-tz-index"
    """

    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)
        kwargs["data-tz-index"] = field.tz_index if hasattr(field, "tz_index") else ""

        markup_super = super().__call__(field, **kwargs)
        return markup_super


@kiosk_wtforms_field
class KioskTzField(StringField, KioskWtFormsFieldExtras):
    widget = KioskTzFieldWidget()

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_field
class KioskStringField(StringField, KioskWtFormsFieldExtras):
    widget = KioskStringFieldWidget()

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_field
class KioskLabeledPrettyCheckboxField(BooleanField, KioskWtFormsFieldExtras):
    widget = KioskLabeledPrettyCheckboxFieldWidget()
    false_values = ('false', '', False)

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_field
class KioskLabeledStringField(StringField, KioskWtFormsFieldExtras):
    widget = KioskLabeledStringFieldWidget()

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_field
class KioskLabeledBooleanField(BooleanField, KioskWtFormsFieldExtras):
    widget = KioskLabeledBooleanFieldWidget()
    false_values = ('false', '', False)

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_field
class KioskLabeledSelectField(SelectField, KioskWtFormsFieldExtras):
    widget = KioskLabeledSelectFieldWidget()

    def pre_validate(self, form):
        if self._validate_choice:
            super().pre_validate(form)

    def __init__(self, *args, **kwargs):
        self._validate_choice = True
        if "validate_choice" in kwargs:
            self._validate_choice = kwargs.pop("validate_choice")
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


@kiosk_wtforms_field
class KioskLabeledTextAreaField(TextAreaField, KioskWtFormsFieldExtras):
    widget = KioskLabeledTextAreaFieldWidget()

    def __init__(self, *args, **kwargs):
        self.init_kiosk_field(args, kwargs)
        super().__init__(*args, **kwargs)


class KioskGeneralFormErrors(object):

    def get_general_form_errors(self):
        if hasattr(self, "general_form_errors"):
            return self.general_form_errors
        else:
            return []

    def add_general_form_error(self, err_msg):
        if not hasattr(self, "general_form_errors"):
            setattr(self, "general_form_errors", [])

        self.general_form_errors.append(err_msg)
