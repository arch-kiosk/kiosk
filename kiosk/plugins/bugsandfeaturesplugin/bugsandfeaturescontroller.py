from werkzeug.datastructures import ImmutableMultiDict

from flask import Blueprint, request, render_template, jsonify, \
    redirect, url_for

from authorization import full_login_required

from .forms.buffilterform import BufFilterForm
from .forms.bugsandfeatureseditform import BafEditBugForm

import kioskglobals
import logging

from core.kioskcontrollerplugin import get_plugin_for_controller
from .models.modelbugsandfeatures import ModelBugsAndFeatures

_plugin_name_ = "bugsandfeaturesplugin"
_controller_name_ = "bugsandfeatures"
_url_prefix_ = '/' + _controller_name_
plugin_version = 1.0

bugsandfeatures = Blueprint(_controller_name_, __name__,
                            template_folder='templates',
                            static_folder="static",
                            url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")


#  refactor: try to move this not DRY method into the plugin.
@bugsandfeatures.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


# def nocache(view):
#     @wraps(view)
#     def no_cache(*args, **kwargs):
#         response = make_response(view(*args, **kwargs))
#         response.headers['Last-Modified'] = datetime.datetime.now()
#         response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
#         response.headers['Pragma'] = 'no-cache'
#         response.headers['Expires'] = '-1'
#         return response
#
#     return update_wrapper(no_cache, view)

# @bugsandfeatures.context_processor
# def custom_js_context():
#     return {'custom_js': url_for('.static', filename='my_file.js')}

#  **************************************************************
#  ****    /file-repository redirecting index
#  **************************************************************
@bugsandfeatures.route('_redirect', methods=['GET'])
@full_login_required
def bugs_and_features_index():
    print("------------- redirecting")
    return redirect(url_for("bugsandfeatures.bugs_and_features_show"))


#  **************************************************************
#  ****    /file-repository index / form request
#  *****************************************************************/
@bugsandfeatures.route('', methods=['GET', 'POST'])
@full_login_required
# @nocache
def bugs_and_features_show():
    conf = kioskglobals.cfg
    print("\n*************** bugs & features/ ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    model_bugs_and_features = ModelBugsAndFeatures(conf, _plugin_name_)
    if request.method == "GET":
        buf_filter_form = BufFilterForm()
        buf_filter_form.init_view_choices(model_bugs_and_features.get_views())
        buf_filter_form.buf_view.data = model_bugs_and_features.get_current_view()
    if request.method == "POST":
        print("\n*************** query bugs and features ")
        print("\n" + str(request.form))
        buf_filter_form = BufFilterForm()
        buf_filter_form.init_view_choices(model_bugs_and_features.get_views())
        model_bugs_and_features.set_current_view(buf_filter_form.buf_view.data)

    records = model_bugs_and_features.query_records()
    return render_template('bugsandfeatures.html', records=records, buf_filter_form=buf_filter_form)


@bugsandfeatures.route('/editdialog/<string:uuid>', methods=['GET', 'POST'])
@full_login_required
# @nocache
def bugsandfeatures_editdialog(uuid):
    cfg = kioskglobals.cfg
    print(f"\n*************** bugs & features edit record {uuid}/ ")
    logging.info(f"bugsandfeatures_editdialog: Editing {uuid}.")

    if request.method == "GET":
        model_bugs_and_features = ModelBugsAndFeatures(cfg, _plugin_name_)
        bug = model_bugs_and_features.get_bug(uuid)
        baf_edit_bug_form = BafEditBugForm(model_bugs_and_features, ImmutableMultiDict(bug))
        return render_template('editbugdialog.html', uuid=uuid, baf_edit_bug_form=baf_edit_bug_form, general_errors=[])

    if request.method == "POST":
        general_errors = []
        model_bugs_and_features = ModelBugsAndFeatures(cfg, _plugin_name_)
        baf_edit_bug_form = BafEditBugForm(model_bugs_and_features)
        rc = model_bugs_and_features.modify_bug(uuid=uuid, data={
            "description": baf_edit_bug_form.description.data,
            "state": baf_edit_bug_form.state.data,
            "priority": baf_edit_bug_form.priority.data,
            "where": baf_edit_bug_form.where.data
        })
        if not rc:
            general_errors += ["Sorry, some error occurred when saving the data. Not clear why."]

        return render_template('editbugdialog.html', uuid=uuid, baf_edit_bug_form=baf_edit_bug_form,
                               general_errors=general_errors)


@bugsandfeatures.route('/delete/<string:uuid>', methods=['POST'])
@full_login_required
def bugsandfeatures_delete(uuid):
    result = "Something was not ok"
    try:
        cfg = kioskglobals.cfg
        print(f"\n*************** bugs & features delete bug {uuid}/ ")
        logging.info(f"bugsandfeatures: deleting {uuid}.")
        model_bugs_and_features = ModelBugsAndFeatures(cfg, _plugin_name_)
        if model_bugs_and_features.delete_bug(uuid):
            result = "ok"
        else:
            result = "Record could not be deleted. That is unexpected. Maybe the log tells you more."

    except Exception as e:
        result = repr(e)
        logging.error(f"bugsandfeatures_delete: Exception {result}")

    return jsonify(result)
