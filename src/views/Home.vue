<template>
  <div class="home">
    <h1>Tag Search Link Generator</h1>
    <div>
      <label for="subreddit">Subreddit:</label>
      <input
        name="subreddit"
        type="text"
        v-model="subreddit"
        placeholder="Subreddit"
      >
    </div>

    <div>
      <label for="tags">Tags, separated by newline:</label>
      <textarea
        name="tags"
        :placeholder="'Aliens\nCats\nVideo Games'"
        rows="10"
        v-model="tagText"
      />
      <div class="btn-group">
        <button @click.prevent="sort" type="button">Sort</button>
        <button @click.prevent="deduplicate" type="button">Deduplicate</button>
      </div>
    </div>

    <div>
      <label for="markdown">Generated markdown:</label>
      <textarea
        name="markdown"
        placeholder="Please enter a subreddit and some tags in the above boxes :)"
        rows="10"
        :value="markdown"
        readonly
        ref="markdown"
      />
      <div class="btn-group">
        <button
          @click.prevent="copyMarkdown"
          type="button"
          v-text="copyMarkdownText"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    subreddit: {
      get() {
        return this.$store.state.subreddit;
      },
      set(value) {
        this.$store.commit('setSubreddit', value);
      },
    },
    strippedSubreddit() {
      const lower = this.subreddit.toLowerCase();

      if (lower.startsWith('/r/')) {
        return this.subreddit.slice(3);
      }

      if (lower.startsWith('r/')) {
        return this.subreddit.slice(2);
      }

      return this.subreddit;
    },
    baseSearchLink() {
      return `https://www.reddit.com/r/${this.strippedSubreddit}/search`;
    },
    tagText: {
      get() {
        return this.$store.state.tagText;
      },
      set(value) {
        this.$store.commit('setTagText', value);
      },
    },
    tags() {
      return this.tagText.split('\n')
        .map(t => t.trim())
        .filter(t => !!t);
    },
    hasTags() {
      return this.tags.length && this.tags.some(t => t.length > 0);
    },
    markdown() {
      if (!this.hasTags || !this.subreddit) {
        return '';
      }

      return this.tags.map((tag) => {
        const params = new URLSearchParams({
          restrict_sr: 1,
          q: `flair_name:"${tag}"`,
        });
        const link = `${this.baseSearchLink}?${params.toString()}`;

        return `[${tag}](${link})`;
      }).join('\n\n');
    },
  },
  data() {
    return {
      copyMarkdownText: 'Copy',
    };
  },
  methods: {
    copyMarkdown() {
      this.$refs.markdown.select();
      document.execCommand('copy');
      this.copyMarkdownText = 'Copied!';
      setTimeout(() => { this.copyMarkdownText = 'Copy'; }, 2000);
    },
    deduplicate() {
      const set = new Set();

      const uniqueTags = this.tags.filter((tag) => {
        if (set.has(tag)) {
          return false;
        }

        set.add(tag);
        return true;
      });

      this.tagText = uniqueTags.join('\n');
    },
    sort() {
      const tags = this.tags.slice();
      tags.sort((a, b) => a.localeCompare(b));
      this.tagText = tags.join('\n');
    },
  },
};
</script>

<style scoped lang="scss">
.btn-group {
  text-align: right;
  margin: 1em 0;
  &>*+* {
    margin-left: 0.5em;
  }
}
</style>
