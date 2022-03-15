import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";

export default {
  name: "visible-list-tags",
  initialize(){
    withPluginApi("0.8.7", api => {

// Display tags in order of importance.
    api.modifyClass("model:topic", {
        pluginId: 'discourse-custom-tag-rendering',

      @discourseComputed("tags")
        visibleListTags(tags) {
            let visibleTags = this._super(...arguments) ?? [];

            let hierachicalTags = [];
            let otherTags = [];
            const roots = ['community','training','admin','events','hermitage'];
            visibleTags.forEach(function(tag) {
               if (roots.includes(tag.split('-')[0])) {
                   hierachicalTags.push(tag);
               } 
               else {
                   otherTags.push(tag)
               }
            });
            hierachicalTags.sort();
            const sortedTags = hierachicalTags.concat(otherTags);
            return sortedTags;
        },
    });

    });
  }
}
