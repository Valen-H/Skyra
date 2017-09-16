const { Language, util } = require('../index');
const Duration = require('../utils/duration');
const moment = require('moment');

const TIMES = {
    DAY: {
        PLURAL: 'ημέρες',
        SING: 'ημέρα',
        SHORT_PLURAL: 'μέρες',
        SHORT_SING: 'μέρα'
    },
    HOUR: {
        PLURAL: 'ώρες',
        SING: 'ώρα',
        SHORT_PLURAL: 'ώρες',
        SHORT_SING: 'ώρα'
    },
    MINUTE: {
        PLURAL: 'λεπτά',
        SING: 'λεπτό',
        SHORT_PLURAL: 'λεπτά',
        SHORT_SING: 'λεπτό'
    },
    SECOND: {
        PLURAL: 'δευτερόλεπτα',
        SING: 'δευτερόλεπτο',
        SHORT_PLURAL: 'δεύτερα',
        SHORT_SING: 'δεύτερο'
    }
};

const PERMS = {
    // General
    ADMINISTRATOR: 'Διαχειριστής',
    VIEW_AUDIT_LOG: 'Προβολή Αρχείου Καταγραφής',
    MANAGE_GUILD: 'Διαχείριση Συντεχνίας',
    MANAGE_ROLES: 'Διαχείριση Τίτλων',
    MANAGE_CHANNELS: 'Διαχείριση Καναλιών',
    KICK_MEMBERS: 'Απομάκρυνση Μελών',
    BAN_MEMBERS: 'Μόνιμη Απομάκρυνση Μελών',
    CREATE_INSTANT_INVITE: 'Δημιουργία Πρόσκλησης',
    CHANGE_NICKNAME: 'Αλλαγή Παρατσουκλιού',
    MANAGE_NICKNAMES: 'Διαχείριση Παρατσουκλιών',
    MANAGE_EMOJIS: 'Διαχείριση Emoji',
    MANAGE_WEBHOOKS: 'Διαχείριση των Webhooks',
    VIEW_CHANNEL: 'Ανάγνωση Μυνημάτων',
    SEND_MESSAGES: 'Αποστολή Μυνημάτων',
    SEND_TTS_MESSAGES: 'Αποστολή Φωνιτικών (TTS) Μυνημάτων',
    MANAGE_MESSAGES: 'Διαχείριση Μυνημάτων',
    EMBED_LINKS: 'Ενσωμάτωση Συνδέσμων',
    ATTACH_FILES: 'Προσάρτηση Αρχείων',
    READ_MESSAGE_HISTORY: 'Ανάγνωση Ιστορικού Μυνημάτων',
    MENTION_EVERYONE: 'Επίκλυση @everyone',
    USE_EXTERNAL_EMOJIS: 'Χρήση Εξωτερικών Emoji',
    ADD_REACTIONS: 'Προσθήκη Αντιδράσεων',
    CONNECT: 'Σύνδεση',
    SPEAK: 'Ομιλία',
    MUTE_MEMBERS: 'Σίγανση Μελών (μικρόφωνο)',
    DEAFEN_MEMBERS: 'Σίγανση Μελών (ακουστικό)',
    MOVE_MEMBERS: 'Μετακίνηση Μελών',
    USE_VAD: 'Χρήση Δραστηριότητας Φωνής'
};

const random = num => Math.round(Math.random() * num);

const EIGHT_BALL = {
    WHEN: ['Σύντομα™', 'Ίσως Αύριο.', 'Ίσως του χρόνου...', 'Ακριβώς τώρα.', 'Σε λίγους μήνες.'],
    WHAT: ['Αεροπλάνο.', 'Τι; Ξαναρώτα.', 'Δώρο.', 'Τίποτα.', 'Δακτυλίδι.', 'Δεν ξέρω, κάτι ίσως.'],
    HOWMUCH: ['Πολύ.', 'Λίγο.', 'Λίγο.', 'Ρώτα με αύριο', 'Δεν ξέρω, ρώτα εναν φυσικό.', 'Τίποτα.', `Μεταξύ ${random(10)} και ${random(1000)}L.`, `${random(10)}e${random(1000)}L.`, "2 ή 3 λίτρα, δεν θυμάμε.", 'Άπειρο.', '1010 λίτρα.'],
    HOWMANY: ['Πολύ.', 'Λίγο.', 'Λίγο.', 'Ρώτα με αύριο.', "Δεν ξέρω, ρώτα εναν φυσικό.", 'Τίποτα.', `Μεταξύ ${random(10)} και ${random(1000)}.`, `${random(10)}e${random(1000)}.`, '2 ή 3, δεν θυμάμε.', 'Άπειρο', '1010.'],
    WHY: ['Μάλλον γενετική.', 'Γιατι κάποιος το αποφάσισε.', 'Για χάρη του σατανά, βεβαίως!', 'Δεν ξέρω, μάλλον η μοίρα.', 'Γιατι το είπα εγω.', 'Δεν έχω ιδέα.', 'Ο Harambe δεν έκανε τίποτα κακό.', 'Ρώτα τον ιδιοκτήτη της συντεχνίας.', 'Ξαναρώτα.', 'Για να πάει στην άλλη πλευρά.', 'Το λέει η βίβλος.'],
    WHO: ['Άνθρωπος.', 'Ρομπότ.', 'Αεροπλάνο.', 'Πουλί.', 'Μια ανθρακική σύνθεση.', 'Ένα μάτσο άσοι και μηδενικά.', 'Δεν έχω ιδέα, είναι υλικό?', 'Δεν είναι λογικό.'],
    ELSE: ['Πιθανών.', 'Όχι.', 'ΝΑΙ!', 'Ίσως.']
};

const duration = (time, short) => Duration.duration(time, TIMES, short);

module.exports = class extends Language {

    constructor(...args) {
        super(...args);
        this.PERMISSIONS = PERMS;
        this.EIGHT_BALL = EIGHT_BALL;

        this.HUMAN_LEVELS = {
            0: 'Καθόλου',
            1: 'Χαμηλό',
            2: 'Μέτριο',
            3: '(╯°□°）╯︵ ┻━┻',
            4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        };

        this.language = {
            DEFAULT: (key) => `${key} δεν υπάρχει για el-GR ακόμα.`,
            DEFAULT_LANGUAGE: 'Προεπιλεγμένη Γλώσσα',

            SETTING_GATEWAY_FOLDER_NOTEXISTS: (folder) => `Ο φάκελος '${folder}' δεν υπάρχει στο τρέχων θεματικό.`,
            SETTING_GATEWAY_KEY_NOTEXISTS: (folder, key) => `Το κλειδί \`${folder}\`::\`${key}\` δεν υπάρχει στο τρέχων θεματικό.`,
            SETTING_GATEWAY_ADD_OR_REMOVE: 'Η παράμετρος τύπος πρέπει να είναι είτε \'add\' ή \'remove\'.',
            SETTING_GATEWAY_NOT_ARRAY: (folder, key) => `The key \`${folder}\`::\`${key}\` does not accept multiple values.`,
            SETTING_GATEWAY_REQUIRE_VALUE: 'Πρέπει να καθορίσεις την τιμή σε add ή remove.',
            SETTING_GATEWAY_ARRAY_ADD_EXISTS: (folder, key, data) => `Η τιμή ${data} για το κλειδί \`${folder}\`::\`${key}\` υπάρχει ήδη.`,
            SETTING_GATEWAY_ARRAY_REMOVE_NOTEXISTS: (folder, key, data) => `Η τιμή ${data} για το κλειδί \`${folder}\`::\`${key}\` δεν υπάρχει.`,

            RESOLVER_INVALID_PIECE: (name, piece) => `'${name}' πρέπει να είναι ένα έγκυρο όνομα ${piece}.`,
            RESOLVER_INVALID_MSG: (name) => `'${name}' πρέπει να είναι μια έγκυρη id μυνήματος.`,
            RESOLVER_INVALID_USER: (name) => `'${name}' πρέπει να είναι μια αναφορά ή έγκυρη id χρήστη.`,
            RESOLVER_INVALID_MEMBER: (name) => `'${name}' πρέπει να είναι μια αναφορά ή έγκυρη id χρήστη.`,
            RESOLVER_INVALID_CHANNEL: (name) => `'${name}' πρέπει να είναι tag ή εγκυρη id καναλιού.`,
            RESOLVER_INVALID_TEXTCHANNEL: (name) => `'${name}' must be a text channel tag or valid text channel id.`,
            RESOLVER_INVALID_VOICECHANNEL: (name) => `'${name}' must be a voice channel tag or valid voice channel id.`,
            RESOLVER_INVALID_GUILD: (name) => `'${name}' must be a valid guild id.`,
            RESOLVER_INVALID_ROLE: (name) => `'${name}' must be a role mention or role id.`,
            RESOLVER_INVALID_LITERAL: (name) => `Your option did not match the only possibility: '${name}'`,
            RESOLVER_INVALID_BOOL: (name) => `'${name}' must be true or false.`,
            RESOLVER_INVALID_INT: (name) => `'${name}' must be an integer.`,
            RESOLVER_INVALID_FLOAT: (name) => `'${name}' must be a valid number.`,
            RESOLVER_INVALID_URL: (name) => `'${name}' must be a valid url.`,
            RESOLVER_INVALID_ATTACHMENT: (name) => `'${name}' must be a valid message attachment or url.`,
            RESOLVER_STRING_SUFFIX: ' characters',
            RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `'${name}' must be exactly ${min}${suffix}.`,
            RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `'${name}' must be between ${min} and ${max}${suffix}.`,
            RESOLVER_MINMAX_MIN: (name, min, suffix) => `'${name}' must be greater than ${min}${suffix}.`,
            RESOLVER_MINMAX_MAX: (name, max, suffix) => `'${name}' must be less than ${max}${suffix}.`,
            RESOLVER_POSITIVE_AMOUNT: 'A positive non-zero number is required for this argument.',

            COMMANDMESSAGE_MISSING: 'Missing one or more required arguments after end of input.',
            COMMANDMESSAGE_MISSING_REQUIRED: (name) => `'${name}' is a required argument.`,
            COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Missing a required option: (${possibles})`,
            COMMANDMESSAGE_NOMATCH: (possibles) => `Your option didn't match any of the possibilities: (${possibles})`,

            CONST_MONITOR_INVITELINK: 'Invite link',
            CONST_MONITOR_NMS: '[NOMENTIONSPAM]',
            CONST_MONITOR_WORDFILTER: 'Filtered Word',

            // Monitors
            MONITOR_NOINVITE: (user) => `|\`❌\`| Dear ${user}, invite links aren't allowed here.`,
            MONITOR_WORDFILTER: (user) => `|\`❌\`| Pardon, dear ${user}, you said something that is not allowed in this server.`,
            MONITOR_NMS_MESSAGE: (user) => [
                `The banhammer has landed and now the user ${user.tag} with id ${user.id} is banned for mention spam.`,
                "Do not worry! I'm here to help you! 😄"
            ].join('\n'),
            MONITOR_NMS_MODLOG: (threshold, amount) => `[NOMENTIONSPAM] Threshold: ${threshold}. Reached: ${amount}`,
            MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error) => `${tag} | **${error}** | You have **30** seconds to respond to this prompt with a valid argument. Type **"ABORT"** to abort this prompt.`,
            MONITOR_COMMAND_HANDLER_ABORTED: 'Aborted',
            MONITOR_SOCIAL_ACHIEVEMENT: 'Congratulations dear %MEMBER%, you achieved the role %ROLE%',

            // Inhibitors
            INHIBITOR_COOLDOWN: (remaining) => `You have just used this command. You can use this command again in ${remaining} seconds.`,
            INHIBITOR_GUILDONLY: 'This command is designed to run only in servers.',
            INHIBITOR_DISABLED: 'This command is currently disabled',
            INHIBITOR_MISSING_BOT_PERMS: (missing) => `Insufficient permissions, missing: **${missing.map(perm => PERMS[perm] || perm)}**`,
            INHIBITOR_PERMISSIONS: 'You do not have permission to use this command',
            INHIBITOR_SPAM: (channel) => `Can we move to ${channel} please? This command might be too spammy and can ruin other people's conversations.`,

            // Commands#anime
            COMMAND_ANIME_DESCRIPTION: (entry, context) => [
                `**English title:** ${entry.english}`,
                `${context.length > 750 ? `${util.splitText(context, 750)}... [continue reading](https://myanimelist.net/anime/${entry.id})` : context}`
            ],
            COMMAND_ANIME_TITLE: (entry) => `${entry.title} (${entry.episodes === 0 ? 'unknown' : entry.episodes} episodes)`,
            COMMAND_ANIME_STATUS: (entry) => [
                `  ❯  Current status: **${entry.status}**`,
                `    • Started: **${entry.start_date}**\n${entry.end_date === '0000-00-00' ? '' : `    • Finished: **${entry.end_date}**`}`
            ],
            COMMAND_MANGA_DESCRIPTION: (entry, context) => [
                `**English title:** ${entry.english}`,
                `${context.length > 750 ? `${util.splitText(context, 750)}... [continue reading](https://myanimelist.net/anime/${entry.id})` : context}`
            ],
            COMMAND_MANGA_TITLE: (entry) => `${entry.title} (${entry.chapters ? 'unknown' : entry.chapters} chapters and ${entry.volumes ? 'unknown' : entry.volumes} volumes)`,
            COMMAND_MANGA_STATUS: (entry) => [
                `  ❯  Current status: **${entry.status}**`,
                `    • Started: **${entry.start_date}**\n${entry.end_date === '0000-00-00' ? '' : `    • Finished: **${entry.end_date}**`}`
            ],
            COMMAND_ANIME_TITLES: {
                TYPE: 'Type',
                SCORE: 'Score',
                STATUS: 'Status',
                WATCH_IT: 'Watch it here:'
            },

            // Commands#fun
            COMMAND_8BALL: (author, input, output) => `🎱 Question by ${author}: *${input}*\n${output}`,
            COMMAND_8BALL_NOT_QUESTION: 'That does not seem to be a question.',
            COMMAND_8BALL_QUESTIONS: {
                WHEN: 'when',
                WHAT: 'what',
                HOW_MUCH: 'how much',
                HOW_MANY: 'how many',
                WHY: 'why',
                WHO: 'who'
            },
            COMMAND_CATFACT: 'Cat Fact',
            COMMAND_DICE: (sides, rolls, result) => `you rolled the **${sides}**-dice **${rolls}** times, you got: **${result}**`,
            COMMAND_NORRIS: 'Chuck Norris',
            COMMAND_RATE: (user, rate, emoji) => `I would give **${user}** a **${rate}**/100 ${emoji}`,
            COMMAND_RATE_MYSELF: ['I love myself a lot 😊', 'myself'],
            COMMAND_RNG: (user, word) => `🕺 *Eeny, meeny, miny, moe, catch a tiger by the toe...* ${user}, I choose:${util.codeBlock('', word)}`,
            COMMAND_RNG_MISSING: 'Please write at least two options separated by comma.',
            COMMAND_RNG_DUP: (words) => `Why would I accept duplicated words? '${words}'.`,
            COMMAND_XKCD_COMICS: (amount) => `There are only ${amount} comics.`,

            // Commands#misc
            COMMAND_UNICODE: (string) => `There is your converted message:\n${string}`,

            // Commands#moderation
            // ## Utilities
            COMMAND_PERMISSIONS: (username, id) => `Permissions for ${username} (${id})`,
            COMMAND_RAID_DISABLED: 'The Anti-RAID system is not enabled in this server.',
            COMMAND_RAID_MISSING_KICK: 'As I do not have the KICK MEMBERS permission, I keep the Anti-RAID unactivated.',
            COMMAND_RAID_LIST: 'List of users in the RAID queue',
            COMMAND_RAID_CLEAR: 'Successfully cleared the RAID list.',
            COMMAND_RAID_COOL: 'Successfully deactivated the RAID.',
            COMMAND_FLOW: (amount) => `${amount} messages have been sent within the last minute.`,
            COMMAND_TIME_TIMED: 'The selected moderation case has already been timed.',
            COMMAND_TIME_UNDEFINED_TIME: 'You must specify a time.',
            COMMAND_TIME_UNSUPPORTED_TIPE: 'The type of action for the selected case cannot be reverse, therefore this action is unsupported.',
            COMMAND_TIME_NOT_SCHEDULED: 'This task is not scheduled.',
            COMMAND_TIME_ABORTED: (title) => `Successfully aborted the schedule for ${title}`,
            COMMAND_TIME_SCHEDULED: (title, user, time) => `✅ Successfully scheduled a moderation action type **${title}** for the user ${user.tag} (${user.id}) with a duration of ${duration(time)}`,

            // ## General
            COMMAND_BAN_NOT_BANNABLE: 'The target is not bannable for me.',
            COMMAND_BAN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **BANNED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}`,
            COMMAND_SOFTBAN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **SOFTBANNED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}`,
            COMMAND_UNBAN_MESSAGE: (user, reason, banReason, log) => `|\`🔨\`| [Case::${log}] **UNBANNED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}${banReason ? `\nReason for Ban:${banReason}` : ''}`,
            COMMAND_UNBAN_MISSING_PERMISSION: `I will need the ${PERMS.BAN_MEMBERS} permission to be able to unban.`,
            COMMAND_KICK_NOT_KICKABLE: 'The target is not kickable for me.',
            COMMAND_KICK_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **KICKED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}`,
            COMMAND_MUTE_MUTED: 'The target user is already muted.',
            COMMAND_MUTE_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **MUTED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}`,
            COMMAND_MUTE_USER_NOT_MUTED: 'This user is not muted.',
            COMMAND_VMUTE_MISSING_PERMISSION: `I will need the ${PERMS.MUTE_MEMBERS} permission to be able to voice unmute.`,
            COMMAND_VMUTE_USER_NOT_MUTED: 'This user is not voice muted.',
            COMMAND_UNMUTE_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **UNMUTED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}`,
            COMMAND_UNMUTE_MISSING_PERMISSION: `I will need the ${PERMS.MANAGE_ROLES} permission to be able to unmute.`,
            COMMAND_WARN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **WARNED**: ${user.tag} (${user.id})${reason ? `\nReason: ${reason}` : ''}`,
            COMMAND_WARN_DM: (moderator, guild, reason) => `You have been warned by ${moderator} in ${guild} for the reason: ${reason}`,

            COMMAND_PRUNE: (amount, total) => `Successfully deleted ${amount} messages from ${total}.`,

            COMMAND_REASON_NOT_EXISTS: 'The selected modlog does not seem to exist.',

            COMMAND_MUTE_CONFIGURE: 'Do you want me to create and configure the Mute role now?',
            COMMAND_MUTE_CONFIGURE_CANCELLED: 'Prompt aborted, the Mute role creation has been cancelled.',

            COMMAND_FILTER_UNDEFINED_WORD: 'You must write what do you want me to filter.',
            COMMAND_FILTER_FILTERED: (filtered) => `This word is ${filtered ? 'already' : 'not'} filtered.`,
            COMMAND_FILTER_ADDED: (word) => `| ✅ | Success! Added the word ${word} to the filter.`,
            COMMAND_FILTER_REMOVED: (word) => `| ✅ | Success! Removed the word ${word} from the filter.`,
            COMMAND_FILTER_RESET: '| ✅ | Success! The filter has been reset.',

            COMMAND_LOCKDOWN_OPEN: (channel) => `The lockdown for the channel ${channel} has been released.`,
            COMMAND_LOCKDOWN_LOCKING: (channel) => `Locking the channel ${channel}...`,
            COMMAND_LOCKDOWN_LOCK: (channel) => `The channel ${channel} is now locked.`,

            COMMAND_LIST_CHANNELS: (name, id) => `List of channels for ${name} (${id})`,
            COMMAND_LIST_ROLES: (name, id) => `List of roles for ${name} (${id})`,
            COMMAND_LIST_MEMBERS: (name, id) => `List of members for the role ${name} (${id})`,
            COMMAND_LIST_INVITES: (name, id) => `List of invite links for ${name} (${id})`,
            COMMAND_LIST_STRIKES: (name) => `List of warnings${name ? ` for ${name}` : ''}`,
            COMMAND_LIST_STRIKES_EMPTY: 'The list of warnings is empty.',
            COMMAND_LIST_STRIKES_ALL: (count, list) => `There are ${count} strikes. Cases: \`${list}\``,
            COMMAND_LIST_STRIKES_EMPTY_FOR: (user) => `There is no warning for the user ${user}`,
            COMMAND_LIST_STRIKES_ENUM: (count) => `There are ${count} strike${count === 1 ? '' : 's'}`,
            COMMAND_LIST_STRIKES_CASE: (number, moderator, reason) => `Case \`${number}\`. Moderator: **${moderator}**\n\`${reason}\``,
            COMMAND_LIST_ADVERTISEMENT: 'List of members advertising.',
            COMMAND_LIST_ADVERTISEMENT_EMPTY: 'Nobody has an advertising url in its playing game.',
            COMMAND_LIST_ROLE_EMPTY: 'This role has no members.',

            COMMAND_ROLE_HIGHER: 'The selected member has higher or equal role position than you.',
            COMMAND_USERSELF: 'Why would you do that to yourself?',
            COMMAND_TOSKYRA: 'Eww... I thought you loved me! 💔',

            // Commands#overwatch
            COMMAND_PLATFORM_REMOVED: (role) => `Your game platform (**${role}**) has been removed.`,
            COMMAND_PLATFORM_UPDATED: (role) => `Your game platform has been updated to: **${role}**`,
            COMMAND_REGION_REMOVED: (role) => `Your game region (**${role}**) has been removed.`,
            COMMAND_REGION_UPDATED: (role) => `Your game region has been updated to: **${role}**`,
            COMMAND_GAMEROLE_UPDATE: (role) => `Your game role has been updated to: **${role}**`,
            COMMAND_RANK_UPDATE: (rank) => `Your rank has been updated to: **${rank}**`,
            MISSING_ROLE: 'You do not have this role.',
            HAS_ROLE: 'You already have this role.',

            // Commands#social
            COMMAND_AUTOROLE_POINTS_REQUIRED: 'You must input a valid amount of points.',
            COMMAND_AUTOROLE_UPDATE_UNCONFIGURED: 'This role is not configured as an autorole. Use the add type instead.',
            COMMAND_AUTOROLE_UPDATE: (role, points, before) => `Updated autorole: ${role.name} (${role.id}). Points required: ${points} (before: ${before})`,
            COMMAND_AUTOROLE_REMOVE: (role, before) => `Removed the autorole: ${role.name} (${role.id}), which required ${before} points.`,
            COMMAND_AUTOROLE_ADD: (role, points) => `Added new autorole: ${role.name} (${role.id}). Points required: ${points}`,
            COMMAND_AUTOROLE_LIST_EMPTY: 'There is no role configured as an autorole in this server.',
            COMMAND_AUTOROLE_UNKNOWN_ROLE: (role) => `Unknown role: ${role}`,

            COMMAND_BALANCE: (user, amount, icon) => `The user ${user} has a total of ${amount}${icon}`,
            COMMAND_BALANCE_SELF: (amount, icon) => `You have a total of ${amount}${icon}`,

            COMMAND_BANNER_LIST_EMPTY: (prefix) => `You do not have an available banner. Check \`${prefix}banner buylist\` for a list of banners you can buy.`,
            COMMAND_BANNER_SET_INPUT_NULL: 'You must specify a banner id to set.',
            COMMAND_BANNER_SET_NOT_BOUGHT: 'You do not have this banner.',
            COMMAND_BANNER_SET: (banner) => `|\`✅\`| **Success**. You have set your banner to: __${banner}__`,
            COMMAND_BANNER_BUY_INPUT_NULL: 'You must specify a banner id to buy.',
            COMMAND_BANNER_BUY_NOT_EXISTS: (prefix) => `This banner id does not exist. Please check \`${prefix}banner buylist\` for a list of banners you can buy.`,
            COMMAND_BANNER_BUY_BOUGHT: (prefix, banner) => `You already have this banner, you may want to use \`${prefix}banner set ${banner}\` to make it visible in your profile.`,
            COMMAND_BANNER_BUY_MONEY: (money, cost, icon) => `You do not have enough money to buy this banner. You have ${money}${icon}, the banner costs ${cost}${icon}`,
            COMMAND_BANNER_BUY: (banner) => `|\`✅\`| **Success**. You have bought the banner: __${banner}__`,
            COMMAND_BANNER_BUY_PAYMENT_CANCELLED: '|`❌`| The payment has been cancelled.',
            COMMAND_BANNER_PROMPT: {
                AUTHOR: 'Author',
                TITLE: 'Title',
                PRICE: 'Price'
            },

            COMMAND_C4_SKYRA: 'I am sorry, I know you want to play with me, but if I do, I will not be able to help other people! 💔',
            COMMAND_C4_BOT: 'I am sorry, but I do not think they would like to stop doing what they are doing and play with humans.',
            COMMAND_C4_PROGRESS: 'I am sorry, but there is a game in progress in this channel, try again when it finishes.',
            COMMAND_C4_PROMPT: (challenger, challengee) => `Dear ${challengee}, you have been challenged by ${challenger} in a Connect-Four math. Reply with **yes** to accept!`,
            COMMAND_C4_PROMPT_TIMEOUT: 'I am sorry, but the challengee did not reply on time.',
            COMMAND_C4_PROMPT_DENY: 'I am sorry, but the challengee refused to play.',
            COMMAND_C4_START: (player, table) => `Let's play! Turn for: **${player}**.\n${table}`,
            COMMAND_C4_GAME_TIMEOUT: '**The match concluded in a draw due to lack of a response (60 seconds)**',
            COMMAND_C4_GAME_COLUMN_FULL: 'This column is full. Please try another.',
            COMMAND_C4_GAME_WIN: (user, table) => `**${user}** won!\n${table}`,
            COMMAND_C4_GAME_DRAW: (table) => `This match concluded in a **draw**!\n${table}`,
            COMMAND_C4_GAME_NEXT: (player, table) => `Turn for: **${player}**.\n${table}`,

            COMMAND_DAILY_TIME: (time) => `Next dailies are available in ${duration(time)}`,
            COMMAND_DAILY_TIME_SUCCESS: (amount, icon) => `Yay! You earned ${amount}${icon}! Next dailies in: 12 hours.`,
            COMMAND_DAILY_GRACE: (remaining) => [
                `Would you like to claim the dailies early? The remaining time will be added up to a normal 12h wait period.`,
                `Remaining time: ${duration(remaining, true)}`
            ].join('\n'),
            COMMAND_DAILY_GRACE_ACCEPTED: (amount, icon, remaining) => `Successfully claimed ${amount}${icon}! Next dailies in: ${duration(remaining)}`,
            COMMAND_DAILY_GRACE_DENIED: 'Got it! Come back soon!',

            COMMAND_LEVEL: {
                LEVEL: 'Level',
                EXPERIENCE: 'Experience',
                NEXT_IN: 'Next level in'
            },

            COMMAND_MYLEVEL: (points, next) => `You have a total of ${points} points.${next}`,
            COMMAND_MYLEVEL_NEXT: (remaining, next) => `\nPoints for next rank: **${remaining}** (at ${next} points).`,

            COMMAND_PAY_MISSING_MONEY: (needed, has, icon) => `I am sorry, but you need ${needed}${icon} and you have ${has}${icon}`,
            COMMAND_PAY_PROMPT: (user, amount, icon) => `You are about to pay ${user} ${amount}${icon}, are you sure you want to proceed?`,
            COMMAND_PAY_PROMPT_ACCEPT: (user, amount, icon) => `Payment accepted, ${amount}${icon} has been sent to ${user}'s profile.`,
            COMMAND_PAY_PROMPT_DENY: 'Payment denied.',
            COMMAND_PAY_SELF: 'If I taxed this, you would lose money, therefore, do not try to pay yourself.',
            COMMAND_SOCIAL_PAY_BOT: 'Oh, sorry, but money is meaningless for bots, I am pretty sure a human would take advantage of it better.',

            COMMAND_PROFILE: {
                GLOBAL_RANK: 'Global Rank',
                CREDITS: 'Credits',
                REPUTATION: 'Reputation',
                EXPERIENCE: 'Experience',
                LEVEL: 'Level'
            },

            COMMAND_REMINDME_INPUT: 'You must tell me what do you want me to remind you and when.',
            COMMAND_REMINDME_TIME: 'Your reminder must be at least one minute long.',
            COMMAND_REMINDME_CREATE: (id) => `A reminder with ID \`${id}\` has been created.`,

            COMMAND_REPUTATION_TIME: (remaining) => `You can give a reputation point in ${duration(remaining)}`,
            COMMAND_REPUTATION_USABLE: 'You can give a reputation point now.',
            COMMAND_REPUTATION_USER_NOTFOUND: 'You must mention a user to give a reputation point.',
            COMMAND_REPUTATION_SELF: 'You cannot give a reputation point to yourself.',
            COMMAND_REPUTATION_BOTS: 'You cannot give a reputation point to bots.',
            COMMAND_REPUTATION_GIVE: (user) => `You have given a reputation point to **${user}**!`,

            COMMAND_REPUTATIONS: (points) => `You have a total of ${points} reputation points.`,

            COMMAND_SCOREBOARD_POSITION: (position) => `Your placing position is: ${position}`,

            COMMAND_SETCOLOR: (color) => `Color changed to ${color}`,

            COMMAND_SLOTMACHINES_MONEY: (money, icon) => `I am sorry, but you do not have enough money to pay your bet! Your current account balance is ${money}${icon}`,
            COMMAND_SLOTMACHINES_WIN: (roll, winnings, icon) => `**You rolled:**\n${roll}\n**Congratulations!**\nYou won ${winnings}${icon}!`,
            COMMAND_SLOTMACHINES_LOSS: (roll) => `**You rolled:**\n${roll}\n**Mission failed!**\nWe'll get em next time!`,

            COMMAND_SOCIAL_PROFILE_NOTFOUND: 'I am sorry, but this user profile does not exist.',
            COMMAND_SOCIAL_PROFILE_BOT: 'I am sorry, but Bots do not have a __Member Profile__.',
            COMMAND_SOCIAL_PROFILE_DELETE: (user, points) => `|\`✅\`| **Success**. Deleted the __Member Profile__ for **${user}**, which had ${points}`,
            COMMAND_SOCIAL_POINTS: 'May you specify the amount of points you want to add or remove?',
            COMMAND_SOCIAL_UPDATE: (action, amount, user, before, now) => `You have just ${action === 'add' ? 'added' : 'removed'} ${amount} ${amount === 1 ? 'point' : 'points'} to the __Member Profile__ for ${user}. Before: ${before}; Now: ${now}.`,

            COMMAND_SUBSCRIBE_NO_ROLE: 'This server does not have a configured announcement role.',
            COMMAND_SUBSCRIBE_SUCCESS: (role) => `Successfully granted the role: **${role}**`,
            COMMAND_UNSUBSCRIBE_SUCCESS: (role) => `Successfully removed the role: **${role}***`,
            COMMAND_SUBSCRIBE_NO_CHANNEL: 'This server does not have a configured announcement channel.',
            COMMAND_ANNOUNCEMENT: (role) => `**New announcement for** ${role}:`,

            COMMAND_CONFIGURATION_ABORT: (reason) => `|\`⚙\`| Prompt System Cancelled: ${reason === 'TIME' ? 'Timed out.' : 'Successfully exited.'}`,

            // Commands#system
            COMMAND_FEEDBACK: '|`✅`| Thanks for your feedback ❤! You will get a response in DMs as soon as possible.',

            COMMAND_RELOAD: (type, name) => `✅ Reloaded ${type}: ${name}`,
            COMMAND_RELOAD_ALL: (type) => `✅ Reloaded all ${type}.`,
            COMMAND_REBOOT: 'Rebooting...',
            COMMAND_PING: 'Ping?',
            COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
            COMMAND_INVITE: (url) => [
                `To add Skyra to your discord guild: <${url}>`,
                'Don\'t be afraid to uncheck some permissions, Skyra will let you know if you\'re trying to run a command without permissions.'
            ],
            COMMAND_HELP_DM: '📥 | Commands have been sent to your DMs.',
            COMMAND_HELP_NODM: '❌ | You have DMs disabled, I couldn\'t send you the commands in DMs.',

            COMMAND_CONF_SELECTKEY: (keys) => `Please, choose between one of the following keys: ${keys}`,
            COMMAND_CONF_ADDED: (folder, key, value) => `Successfully added the value \`${value}\` to the key: \`${folder}\`::\`${key}\``,
            COMMAND_CONF_UPDATED: (folder, key, response) => `Successfully updated the key \`${folder}\`::\`${key}\`: \`${response}\``,
            COMMAND_CONF_KEY_NOT_ARRAY: 'This key is not array type. Use the action \'reset\' instead.',
            COMMAND_CONF_REMOVE: (folder, key, value) => `Successfully removed the value \`${value}\` from the key: \`${folder}\`::\`${key}\``,
            COMMAND_CONF_GET: (folder, key, value) => `The value for the key \`${folder}\`::\`${key}\` is: \`${value}\``,
            COMMAND_CONF_RESET: (folder, key, response) => `The key \`${folder}\`::\`${key}\` has been reset to: \`${response}\``,
            COMMAND_STATS: (STATS, UPTIME, USAGE) => [
                '= STATISTICS =',
                `• Users      :: ${STATS.USERS}`,
                `• Servers    :: ${STATS.GUILDS}`,
                `• Channels   :: ${STATS.CHANNELS}`,
                `• Discord.js :: ${STATS.VERSION}`,
                `• Node.js    :: ${STATS.NODE_JS}`,
                '',
                '= UPTIME =',
                `• Host       :: ${UPTIME.HOST}`,
                `• Total      :: ${UPTIME.TOTAL}`,
                `• Client     :: ${UPTIME.CLIENT}`,
                '',
                '= HOST USAGE =',
                `• CPU Load   :: ${USAGE.CPU_LOAD}`,
                `• RAM +Node  :: ${USAGE.RAM_TOTAL}`,
                `• RAM Usage  :: ${USAGE.RAM_USED}`
            ].join('\n'),

            // Commands#tags
            COMMAND_TAGS_NAME_REQUIRED: 'You must specify a tag name.',
            COMMAND_TAGS_ADD_EXISTS: (tag) => `The tag '${tag}' already exists.`,
            COMMAND_TAGS_CONTENT_REQUIRED: 'You must provide a content for this tag.',
            COMMAND_TAGS_ADD_ADDED: (name, content) => `Successfully added a new tag: **${name}** with a content of **${content}**.`,
            COMMAND_TAGS_REMOVE_NOT_EXISTS: (tag) => `The tag '${tag}' does not exist.`,
            COMMAND_TAGS_REMOVE_REMOVED: (name) => `Successfully removed the tag **${name}**.`,
            COMMAND_TAGS_EDITED: (name, content, old) => `Successfully edited the tag **${name}** which had a content of **${old}** to **${content}**.`,
            COMMAND_TAGS_LIST_EMPTY: 'The tag list for this server is empty.',

            // Commands#tools
            COMMAND_CALC: (time, output) => `|\`⚙\`| **Calculated** (${time}μs)${output}`,
            COMMAND_CALC_FAILURE: (time, output) => `|\`❌\`| **Failed** (${time}μs)${output}`,

            COMMAND_COLOR: (hex, rgb, hsl) => [
                `HEX: **${hex}**`,
                `RGB: **${rgb}**`,
                `HSL: **${hsl}**`
            ].join('\n'),

            COMMAND_CURRENCYLAYER_INPUT: (input) => `${input} is either not a valid currency or is not accepted by the API.`,
            COMMAND_CURRENCYLAYER_ERROR: 'I am sorry, but the API returned a bad response.',
            COMMAND_CURRENCYLAYER: (money, input, output, converted) => `**${money}** from \`${input}\` to \`${output}\` equals to:${converted}`,

            COMMAND_DEFINE_NOTFOUND: 'I could not find a definition for this word.',
            COMMAND_DEFINE: (input, output) => `Search results for \`${input}\`:\n${output}`,

            COMMAND_EMOJI_CUSTOM: (emoji, id) => [
                `→ \`Emoji\` :: **${emoji}**`,
                '→ `Type` :: **Custom**',
                `→ \`ID\` :: **${id}**`
            ].join('\n'),
            COMMAND_EMOJI_TWEMOJI: (emoji, id) => [
                `→ \`Emoji\` :: \\${emoji}`,
                '→ `Type` :: **Twemoji**',
                `→ \`ID\` :: **${id}**`
            ].join('\n'),
            COMMAND_EMOJI_INVALID: (emoji) => `'${emoji}' is not a valid emoji.`,

            COMMAND_GOOGL_LONG: (url) => `**Shortened URL: [${url}](${url})**`,
            COMMAND_GOOGL_SHORT: (url) => `**Expanded URL: [${url}](${url})**`,

            COMMAND_QUOTE_MESSAGE: 'It is very weird, but said message does not have a content nor a image.',

            COMMAND_ROLES_LIST_EMPTY: 'This server does not have a role listed as a public role.',
            COMMAND_ROLES_LIST_TITLE: (guild) => `List of Public Roles for ${guild}`,
            COMMAND_ROLES_CLAIM_EXISTENT: (roles) => `You already have the following roles: \`${roles}\``,
            COMMAND_ROLES_CLAIM_GIVEN: (roles) => `The following roles have been added to your profile: \`${roles}\``,
            COMMAND_ROLES_UNCLAIM_UNEXISTENT: (roles) => `You do not have the following roles: \`${roles}\``,
            COMMAND_ROLES_UNCLAIM_REMOVED: (roles) => `The following roles have been removed from your profile: \`${roles}\``,
            COMMAND_ROLES_NOT_PUBLIC: (roles) => `The following roles are not public: \`${roles}\``,
            COMMAND_ROLES_NOT_FOUND: (roles) => `Roles not found: \`${roles}\``,

            COMMAND_SERVERINFO_TITLE: (name, id) => `Statistics for **${name}** (ID: **${id}**)`,
            COMMAND_SERVERINFO_TITLES: {
                CHANNELS: 'Channels',
                MEMBERS: 'Members',
                OTHER: 'Other',
                USERS: 'Users'
            },
            COMMAND_SERVERINFO_CHANNELS: (text, voice, categories, afkChannel, afkTime) => [
                `• **${text}** Text, **${voice}** Voice, **${categories}** categories.`,
                `• AFK: ${afkChannel ? `**<#${afkChannel}>** after **${afkTime / 60}**min` : '**None.**'}`
            ].join('\n'),
            COMMAND_SERVERINFO_MEMBERS: (count, owner) => [
                `• **${count}** members`,
                `• Owner: **${owner.tag}**`,
                `  (ID: **${owner.id}**)`
            ].join('\n'),
            COMMAND_SERVERINFO_OTHER: (size, region, createdAt, verificationLevel) => [
                `• Roles: **${size}**`,
                `• Region: **${region}**`,
                `• Created at: **${moment.utc(createdAt).format('D/M/YYYY, HH:mm:ss')}** (UTC - DD/MM/YYYY)`,
                `• Verification Level: **${this.HUMAN_LEVELS[verificationLevel]}**`
            ].join('\n'),
            COMMAND_SERVERINFO_USERS: (online, offline, percentage, newbies) => [
                `• Online/Offline users: **${online}**/**${offline}** (${percentage}% users online)`,
                `• **${newbies}** new users within the last 24h.`
            ].join('\n'),

            COMMAND_URBAN_NOTFOUND: 'I am sorry, the word you are looking for does not seem to be defined in UrbanDictionary. Try another word?',
            COMMAND_URBAN_INDEX_NOTFOUND: 'You may want to try a lower page number.',
            SYSTEM_TEXT_TRUNCATED: (definition, url) => `${definition}... [continue reading](${url})`,
            COMMAND_URBAN_DESCRIPTION: (index, pages, definition, example, author) => [
                `→ \`Definition\` :: ${index}/${pages}\n_${definition}`,
                `→ \`Example\` :: ${example}`,
                `→ \`Author\` :: ${author}`
            ].join('\n\n'),

            COMMAND_WHOIS_MEMBER: (member) => [
                `${member.nickname ? `aka **${member.nickname}**.\n` : ''}`,
                `With an ID of \`${member.user.id}\`,`,
                `this user is **${member.user.presence.status}**${member.user.presence.game ? `, playing: **${member.user.presence.game.name}**` : '.'}`,
                '\n',
                `\nJoined Discord on ${moment.utc(member.user.createdAt).format('D/MM/YYYY [at] HH:mm:ss')}`,
                `\nJoined ${member.guild.name} on ${moment.utc(member.joinedAt).format('D/MM/YYYY [at] HH:mm:ss')}`
            ].join(' '),
            COMMAND_WHOIS_MEMBER_ROLES: '→ `Roles`',
            COMMAND_WHOIS_USER: (user) => [
                `With an ID of \`${user.id}\``,
                '\n',
                `Joined Discord at ${moment.utc(user.createdAt).format('D/MM/YYYY [at] HH:mm:ss')}`
            ].join(' '),

            COMMAND_WIKIPEDIA_NOTFOUND: 'I am sorry, I could not find something that could match your input in Wikipedia.',

            COMMAND_YOUTUBE_NOTFOUND: 'I am sorry, I could not find something that could match your input in YouTube.',
            COMMAND_YOUTUBE_INDEX_NOTFOUND: 'You may want to try a lower page number. Because I am unable to find something at this index.',

            // Commands#weather
            COMMAND_WEATHER_ERROR_ZERO_RESULTS: 'Your request returned no results.',
            COMMAND_WEATHER_ERROR_REQUEST_DENIED: 'The GeoCode API Request was denied.',
            COMMAND_WEATHER_ERROR_INVALID_REQUEST: 'Invalid request.',
            COMMAND_WEATHER_ERROR_OVER_QUERY_LIMIT: 'Query Limit Exceeded. Try again tomorrow.',
            COMMAND_WEATHER_ERROR_UNKNOWN: 'Unknown error.',

            // Modlogs
            MODLOG_APPEALED: 'The selected moderation case has already been appealed.',
            MODLOG_TIMED: (remaining) => `This action is already scheduled and ending in ${duration(remaining)}`,
            MODLOG_PENDING_REASON: (prefix, number) => `Use ${prefix}reason ${number} to claim this case.`,

            // System only
            SYSTEM_DM_SENT: 'I have sent you the message in DMs.',
            SYSTEM_DM_FAIL: 'I cannot send you a message in DMs, did you block me?',
            SYSTEM_FETCHING: '`Fetching...`',
            SYSTEM_PROCESSING: '`Processing...`',
            SYSTEM_HIGHEST_ROLE: 'This role\'s hierarchy position is higher or equal than me, I am not able to grant it to anyone.',
            SYSTEM_CHANNEL_NOT_POSTABLE: 'I am not allowed to send messages to this channel.',
            SYSTEM_FETCHBANS_FAIL: `Failed to fetch bans. Do I have the ${PERMS.BAN_MEMBERS} permission?`,
            SYSTEM_LOADING: '`Loading... please wait.`',
            SYSTEM_ERROR: 'Something happened!',
            SYSTEM_MESSAGE_NOT_FOUND: 'I am sorry, but either you wrote the message ID incorrectly, or it got deleted.',

            LISTIFY_PAGE: (page, pageCount, results) => `Page ${page} / ${pageCount} | ${results} Total`,

            COMMAND_SUCCESS: 'Successfully executed the command.',

            GUILD_SETTINGS_CHANNELS_MOD: 'This command requires a modlog channel to work.',
            GUILD_SETTINGS_ROLES_MUTED: 'This command requires a configured role for mutes.',
            GUILD_BANS_EMPTY: 'There are no bans registered in this server.',
            GUILD_BANS_NOT_FOUND: 'Please, write a valid user ID or tag.',
            GUILD_MUTE_NOT_FOUND: 'This user is not muted.',
            CHANNEL_NOT_READABLE: `I am sorry, but I need the permission **${PERMS.VIEW_CHANNEL}**`,

            USER_NOT_IN_GUILD: 'This user is not in this server.',

            EVENTS_GUILDMEMBERADD: 'User Joined',
            EVENTS_GUILDMEMBERADD_MUTE: 'Muted User joined',
            EVENTS_GUILDMEMBERADD_RAID: 'Raid Detected',
            EVENTS_GUILDMEMBERREMOVE: 'User left',
            EVENTS_GUILDMEMBER_UPDATE_NICKNAME: (previous, current) => `Updated the nickname from **${previous}** to **${current}**`,
            EVENTS_GUILDMEMBER_ADDED_NICKNAME: (previous, current) => `Added a new nickname **${current}**`,
            EVENTS_GUILDMEMBER_REMOVED_NICKNAME: (previous) => `Removed the nickname **${previous}**`,
            EVENTS_GUILDMEMBER_UPDATE_ROLES: (removed, added) => `${removed.length > 0 ? `Removed the role${removed.length > 1 ? 's' : ''}: ${removed.join(', ')}\n` : ''}${added.length > 0 ? `Added the role${added.length > 1 ? 's' : ''}: ${added.join(', ')}` : ''}`,
            EVENTS_MESSAGE_UPDATE: 'Message Edited',
            EVENTS_MESSAGE_UPDATE_MSG: (old, msg) => `Previous: ${old.substring(0, 950)}\nNew: ${msg.substring(0, 950)}`,
            EVENTS_MESSAGE_DELETE: 'Message Deleted',
            EVENTS_MESSAGE_DELETE_MSG: (msg) => msg.substring(0, 1900),
            EVENTS_COMMAND: (command) => `Command Used: ${command}`,
            EVENTS_STREAM_START: (member) => `The user **${member.user.tag}** is now live! **${member.presence.game.name}**\n${member.presence.game.url}`,
            EVENTS_STREAM_STOP: (member) => `The user **${member.user.tag}** is not longer live!`,

            SETTINGS_DELETE_CHANNELS_DEFAULT: 'Removed Settings Channels::default',
            SETTINGS_DELETE_ROLES_INITIAL: 'Removed Setting Roles::initial',
            SETTINGS_DELETE_ROLES_MUTE: 'Removed Setting Roles::mute',

            TYPES_MEMBER_ROLE_UPDATE: 'Member Role Update',
            TYPES_MEMBER_NICKNAME_UPDATE: 'Member Nickname Update',

            LISTIFY_INVALID_INDEX: 'Invalid index, expected an integer.',
            REQUIRE_USER: 'You must input a valid username, tag, or mention.',
            REQUIRE_ROLE: 'You must input a valid role name or mention',

            ERROR_WTF: 'What a Terrible Failure! I am very sorry!',
            ERROR_STRING: (mention, message) => `Dear ${mention}, ${message}`,

            CONST_USERS: 'Users'
        };
    }

};
