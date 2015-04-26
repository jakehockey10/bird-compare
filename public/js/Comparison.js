/**
 * Created by jake on 4/25/15.
 */
/**
 * Comparison Class to change the results of eBird endpoint results
 */

var Comparison = function (left, right) {
    var leftTotal = left.length;
    var rightTotal = right.length;
    var total = leftTotal + rightTotal;
    var leftTotalString = leftTotal + ' observations';
    var rightTotalString = rightTotal + ' observations';
    var leftTotalIsBigger = leftTotal > rightTotal;
    var leftTotalClass = leftTotalIsBigger ? 'success' : 'danger';
    var rightTotalClass = leftTotalIsBigger ? 'danger' : 'success';
    var leftTotalIcon = leftTotalIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
    var rightTotalIcon = leftTotalIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';


    var leftSciNameGroups = _.groupBy(left, 'sciName');
    var rightSciNameGroups = _.groupBy(right, 'sciName');
    var leftSciNames = Object.keys(leftSciNameGroups);
    var rightSciNames = Object.keys(rightSciNameGroups);
    var union = _.union(leftSciNames, rightSciNames);
    var totalSpecies = union.length;
    var leftSciNameCount = leftSciNames.length;
    var rightSciNameCount = rightSciNames.length;
    var leftSpeciesCountIsBigger = leftSciNameCount > rightSciNameCount;
    var leftSpeciesClass = leftSpeciesCountIsBigger ? 'success' : 'danger';
    var rightSpeciesClass = leftSpeciesCountIsBigger ? 'danger' : 'success';
    var leftSpeciesIcon = leftSpeciesCountIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
    var rightSpeciesIcon = leftSpeciesCountIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';


    var leftLocNames = _.groupBy(left, 'locName');
    var rightLocNames = _.groupBy(right, 'locName');
    leftLocNames = _.mapValues(leftLocNames, function (name) {
        var total = 0;
        name.forEach(function (observation) {
            // TODO: make sure to check whether this should be 0 or 1 if the object doesn't contain howMany key.
            total += observation.howMany || 0;
        });
        name.total = total;
        return name;
    });
    rightLocNames = _.mapValues(rightLocNames, function (name) {
        var total = 0;
        name.forEach(function (observation) {
            // TODO: make sure to check whether this should be 0 or 1 if the object doesn't contain howMany key.
            total += observation.howMany || 0;
        });
        name.total = total;
        return name;
    });
    var leftLocAmount = Object.keys(leftLocNames).length;
    var rightLocAmount = Object.keys(rightLocNames).length;
    var leftNameMaxObs = _.max(leftLocNames, function (name) {
        return name.total;
    });
    var rightNameMaxObs = _.max(rightLocNames, function (name) {
        return name.total;
    });
    var leftLocAmountIsBigger = leftLocAmount > rightLocAmount;
    var leftLocAmountClass = leftLocAmountIsBigger ? 'success' : 'danger';
    var rightLocAmountClass = leftLocAmountIsBigger ? 'danger' : 'success';
    var leftLocAmountIcon = leftLocAmountIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
    var rightLocAmountIcon = leftLocAmountIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';
    var leftLocMostIsBigger = leftNameMaxObs.total > rightNameMaxObs.total;
    var leftLocMostClass = leftLocMostIsBigger ? 'success' : 'danger';
    var rightLocMostClass = leftLocMostIsBigger ? 'danger' : 'success';
    var leftLocMostIcon = leftLocMostIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
    var rightLocMostIcon = leftLocMostIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';

    return {
        total: total,
        totalSpecies: totalSpecies,
        left: {
            total: {
                amount: leftTotal,
                string: leftTotalString,
                class: leftTotalClass,
                icon: leftTotalIcon
            },
            species: {
                groups: leftSciNameGroups,
                amount: leftSciNameCount,
                class: leftSpeciesClass,
                icon: leftSpeciesIcon
            },
            locations: {
                amount: leftLocAmount,
                most: leftNameMaxObs,
                amountClass: leftLocAmountClass,
                amountIcon: leftLocAmountIcon,
                mostClass: leftLocMostClass,
                mostIcon: leftLocMostIcon
            }
        },
        right: {
            total: {
                amount: rightTotal,
                string: rightTotalString,
                class: rightTotalClass,
                icon: rightTotalIcon
            },
            species: {
                groups: rightSciNameGroups,
                amount: rightSciNameCount,
                class: rightSpeciesClass,
                icon: rightSpeciesIcon
            },
            locations: {
                amount: rightLocAmount,
                most: rightNameMaxObs,
                amountClass: rightLocAmountClass,
                amountIcon: rightLocAmountIcon,
                mostClass: rightLocMostClass,
                mostIcon: rightLocMostIcon
            }
        }
    };
};
