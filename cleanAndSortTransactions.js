const input = require('./exampleInput.json');
const _ = require('lodash');

function findDuplicateTransactions(input) {
    // sort by time
    const transactions = _.sortBy(input, 'time');
    let key=1; //key used to time based grouping
    // group consecutive transaction is less than 1 minute 
    const [uniqueGroups]=Object.values(_.reduce(transactions, (previous, current) => {
        // update key if the time difference is more than 1 minute
        if (previous[key]!==undefined && Math.abs(new Date(previous[key][previous[key].length-1].time) - new Date(current.time))/1000 > 60)
            key++;
        return {...previous, [key]: [...((previous[key]) || []), current]};
    }, {}))
    // further group by sourceAccount, tragetAccount, amount, category
    .map(transactions =>Object.values(_.groupBy(transactions, transaction => `"${transaction.sourceAccount}+${transaction.targetAccount}+${transaction.amount}+${transaction.category}"`)))
    // filter out unique transactions
    .filter(group=> group.length > 1);
    // sort all groups by category
    return _.sortBy(uniqueGroups, group => group[0].category);
}
console.log('Duplicated Transactions', findDuplicateTransactions(input));