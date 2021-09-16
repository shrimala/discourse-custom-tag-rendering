import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";
import getURL from "discourse-common/lib/get-url";
import Handlebars from "handlebars";
import { helperContext } from "discourse-common/lib/helpers";

function iconTagRenderer(tag, params) {
  let { siteSettings, currentUser } = helperContext();
  let t = settings.tag_icon_list.split("|");

  params = params || {};

  // Custom code here /////////////////////////////////////////////
  // Allow visible name to be overridden.
  //const visibleName = Handlebars.Utils.escapeExpression(tag);
  let visibleName = Handlebars.Utils.escapeExpression(tag);

  tag = visibleName.toLowerCase();

  const classes = ["discourse-tag"];
  
  
  // Custom code here ///////////////////////////////////////////////////////////////////////
  // Handle hierachical tags
  const roots = ['community','training','admin','events','hermitage'];
  let tagParts = tag.split('-');
  if (roots.includes(tagParts[0])) {
     classes.push('hierachical-tag');
     if(tagParts.length > 1) {
         classes.push('child-tag');
         if (params.noHref) {
           // Special handling is needed within lists where we do want to show every pat of the tag.
           let escapedParts = tagParts.map(tagPart => '<span class="tag-part">' + Handlebars.Utils.escapeExpression(tagPart) + '</span>');
           //let lastPart = escapedParts.pop();
           //let tagIconHTML = `<span class="tag-icon">${iconHTML('chevron-right')}</span>`;
           //let otherParts = `<span class="parents">${escapedParts.join(tagIconHTML)}</span>`;
           //visibleName = otherParts + tagIconHtml + lastPart;
           visibleName = tag;
         }
         else {
           visibleName = Handlebars.Utils.escapeExpression(tagParts.pop());
           otherParts = Handlebars.Utils.escapeExpression(tagParts.join
           let tagIconItem = tagIconList.find((str) => {
              return str.indexOf(",") > -1 ? tag === str.substr(0, str.indexOf(",")) : "";
          });
          if (!tagIconItem) {
              tagIconList.push(tag + ',chevron-right');
          }
        }   
     }
  }
  // End custom code ///////////////////////////////////////////////////////////////////////  
  
  const tagName = params.tagName || "a";
  let path;
  if (tagName === "a" && !params.noHref) {
    if (params.isPrivateMessage && currentUser) {
      const username = params.tagsForUser
        ? params.tagsForUser
        : currentUser.username;
      path = `/u/${username}/messages/tags/${tag}`;
    } else {
      path = `/tag/${tag}`;
    }
  }
  const href = path ? ` href='${getURL(path)}' ` : "";
  if (siteSettings.tag_style || params.style) {
    classes.push(params.style || siteSettings.tag_style);
  }

  /// Add custom tag icon from theme settings
  let tagIconItem = tagIconList.find((str) => {
    return str.indexOf(",") > -1 ? tag === str.substr(0, str.indexOf(",")) : "";
  });

  let tagIconHTML = "";
  if (tagIconItem) {
    let tagIcon = tagIconItem.split(",");

    let itemColor = tagIcon[2] ? `style="color: ${tagIcon[2]}"` : "";
    tagIconHTML = `<span ${itemColor} class="tag-icon">${iconHTML(
      tagIcon[1]
    )}</span>`;
  }
  /// End custom tag icon

  let val =
    "<" +
    tagName +
    href +
    " data-tag-name=" +
    tag +
    " class='" +
    classes.join(" ") +
    "'>" +
    tagIconHTML + // inject tag Icon in html
    visibleName +
    "</" +
    tagName +
    ">";

  if (params.count) {
    val += " <span class='discourse-tag-count'>x" + params.count + "</span>";
  }

  return val;
}

export default {
  name: "tag-icons",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.replaceTagRenderer(iconTagRenderer);
    });
  },
};
