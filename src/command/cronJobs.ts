const cron = require('node-cron');
import { config } from '@config/config';
import { Db } from '@domain/db';
import { format } from 'date-fns-tz';


const CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE = config.CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE;

// ตัวอย่าง cron job ทำงานทุก 5 นาที
const cronJobResetBankAccount = cron.schedule(CRONJOB_RESET_BANK_ACCOUNT_SCHEDULE, async () => {
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss zzz');
    console.log(`RUN: cronJobResetBankAccount ${dateTime}`);

    await Db.conn('bankAccounts').update({
        todayTopUpTruemoneyBalance: 0,
    });
});

const CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_SCHEDULE = config.CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_SCHEDULE;
const CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_EX_API_TOKEN = config.CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_EX_API_TOKEN;

const cronJobNotifyBankAccountSummary = cron.schedule(CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_SCHEDULE, async () => {
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss zzz');
    console.log(`RUN: cronJobNotifyBankAccountSummary ${dateTime}`);

    const fetch = require('node-fetch');

    let url = `${config.appUrl}/api/bank-gateway/notify?token=${CRONJOB_NOTIFY_BANK_ACCOUNT_SUMMARY_EX_API_TOKEN}`;

    let options = { method: 'GET' };

    await fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));

});

cronJobResetBankAccount.start();
cronJobNotifyBankAccountSummary.start();
console.log("cronJob start!!!");