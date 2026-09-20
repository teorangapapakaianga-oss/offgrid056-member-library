# Member progress, backup and privacy (V1)

## In plain terms

**Everything the library remembers about a member stays inside that member's own browser.**

- Progress, favourites, completion, notes, recently viewed and 30-Day Programme state are stored **only in the
  browser they are using**, in its own local storage.
- **They are not synchronised to an account, a server or a database.** V1 has no account and no server to sync to.
- **They leave the browser only when the member deliberately exports a backup file**, which downloads to their own
  device. Nothing is sent anywhere automatically, and OffGrid056 never receives it.
- Nothing is tracked: there is no analytics, no advertising code and no third-party script in the library.

What that means day to day:

- Progress does not follow a member from their phone to their laptop unless they move a backup file across.
- Clearing browser data, or using private browsing, loses the progress in that browser.
- Two people sharing one browser profile share one set of progress.

## What is stored

One entry under the key `og056.member.v1`:

| Kept | Detail |
|---|---|
| Saved resources | resource id and the date saved |
| Completed resources | resource id and the date completed |
| Recently viewed | the last 20, newest first |
| Where you left off | the last resource or programme day opened |
| Programme | which days are complete, and the member's own notes (up to 2,000 characters a day) |
| Assessments | reserved for future scored assessments |

Everything is keyed by the resource's **permanent id**, so renaming or re-slugging a resource never loses anyone's
progress. No name, email, address or any other personal detail is stored — the library never asks for one.

## Back up and restore

On **My Progress**:

- **Back up my progress** downloads `og056-progress-YYYY-MM-DD.json` to the member's device. It contains exactly
  what is listed above, and nothing else.
- **Restore from a backup** reads a file the member chooses. It is accepted only if it is a genuine backup of this
  library at a version the library understands and every field is valid. Anything else is refused with a plain
  reason, **and nothing changes**.
- After a valid file is read, the member sees what it contains and chooses:
  - **Merge (recommended)** — keeps everything they already have and adds what the backup holds. Saved and
    completed keep the earliest date, a programme day counts as done if it is done on either side, the newer note
    wins, and **nothing is ever removed**.
  - **Replace** — discards the progress in this browser and uses the backup instead.

## Start again

Also on My Progress, kept apart from everything else. It erases all progress in that browser, and it is
deliberately hard to trigger by accident:

- disabled when there is nothing to erase;
- lists exactly what will be removed, and what is not affected;
- offers **"Back up my progress first"**;
- requires the member to type **START AGAIN**;
- defaults focus to "Keep my progress", and Esc cancels.

It cannot be undone, which is why the backup is offered in the same dialog.

## When storage is unavailable

In private browsing, or when site data is blocked or full, the library keeps working for that visit and shows:
*"Your progress can't be saved in this browser."* Nothing is written. If stored progress is ever unreadable, the
library keeps a copy under a separate key, starts clean and tells the member.

## Limits of V1 — please read before publishing

- **There is no login.** Anyone who has the address can open every page.
- **There is no paid-access enforcement.** The `premium` flag exists in the data but nothing checks it.
- **Real member-only resources should not be published openly.** Until accounts exist, either keep the site behind
  a private link (see `docs/DEPLOYMENT.md`) or publish demonstration content only.
- The site carries `noindex` and a `robots.txt` disallow, which keeps it out of search results but does not stop
  anyone with the address.

## When accounts arrive

The storage layer is a single swap point (`lib/member/store.ts`). A server-backed store replaces it without
changing any page or component, and on a member's first sign-in their browser progress is merged into their
account using exactly the merge rules above. See `docs/ARCHITECTURE.md` §14.
