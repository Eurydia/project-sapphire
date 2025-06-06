- integration with git host providers
- login with credential to access repos (need client id for each provider -> client secrets storage)
  - pros: sync tags, description and other details with repo
  - downside: can only manage ongoing and completed projects
    - need local way to store picthed and planned (but not started) projects
- brain dump -> repo wiki
- physical file
  - consideration: conflicts and desynchronization
- can only brain dump onto existing (albeit empty) repo -> sense of commitment
  - create empty repo on GitHub -> prepare wiki -> brain dump
- hybrid (database + local file)
  - database: tracks metadata, repo directory
  - local file: edit, git repo

---

- keep copy on database for security reasons
- sync on start up/page update/force refresh
- dont show file content but open it in default app
  - avoid incompaitble format/flavour of markdown
