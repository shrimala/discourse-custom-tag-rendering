import { acceptance, queryAll } from "discourse/tests/helpers/qunit-helpers";
import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import topicFixtures from "discourse/tests/fixtures/topic";

acceptance("Topic with tags", function (needs) {
  needs.settings({ tagging_enabled: true });

  const topicResponse = topicFixtures["/t/280/1.json"];
  topicResponse.tags = ["tag1"];

  test("Decorate topic title", async function (assert) {
    await visit("/t/internationalization-localization/280");

    assert.ok(queryAll(".title-wrapper .discourse-tags"), "it has tags");
    assert.ok(
      queryAll(".discourse-tags a.discourse-tag .tag-icon").length,
      "it has tag icon"
    );

    const el = queryAll(".discourse-tags a.discourse-tag .tag-icon")[0];

    assert.equal(
      window.getComputedStyle(el).color,
      "rgb(204, 0, 0)",
      "tag icon color matches default value"
    );
  });
});