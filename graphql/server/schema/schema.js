const graphql = require("graphql");
const _ = require("lodash");
const rp = require('request-promise')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull } = graphql;

// dummy data
var notices = [
    { topic: 'the first topic', description: 'the first description', id: '1', day: 10, weekNumber: 4, month: 8 },
    { topic: 'the second topic', description: 'the second description', id: '2', day: 4, weekNumber: 8, month: 10 },
    { topic: 'the third topic', description: 'the third description', id: '3', day: 5, weekNumber: 15, month: 9 }
];

var url = "http://192.168.56.101:";
const instance_port_pool = [9090, 9091, 9092, 9093, 9094];

const NoticeType = new GraphQLObjectType({
    name: 'Notice',
    fields: () => ({
        id: { type: GraphQLInt },
        topic: { type: GraphQLString },
        description: { type: GraphQLString },
        day: { type: GraphQLInt },
        weekNumber: { type: GraphQLInt },
        month: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    // entry to graph
    name: 'RootQueryType',
    fields: {
        notice: {
            type: NoticeType,
            args: { id: { type: GraphQLInt } },
            description: 'Return notice of specified id',
            resolve(parent, args) {
                var out = rp(randomAddress() + "/getNotice/" + args.id)
                    .then(function (str) {
                        var json = JSON.parse(str)
                        return json;
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        console.log(err);
                        return err;
                    });
                return out
            }
        },
        notices: {
            type: new GraphQLList(NoticeType),
            description: 'Returns all notices',
            resolve(parent, args) {
                var oo = rp(randomAddress() + "/getNotices")
                    .then(function (str) {
                        var json = JSON.parse(str)
                        return json;
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        console.log(err);
                        return err;
                    });
                return oo;
            }
        },
        // heck, doing this to keep it simple and easier
        dayNotices: {
            type: new GraphQLList(NoticeType),
            args: { day: { type: GraphQLInt } },
            description: 'Return notices of specific day',
            resolve(parent, args) {
                // code to get data from source
                var oo = rp(randomAddress() + "/getNotices")
                    .then(function (str) {
                        var json = JSON.parse(str)
                        return _.filter(json, { day: args.day });
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        console.log(err);
                        return err;
                    });
                return oo;
            }
        },
        weekNotices: {
            type: new GraphQLList(NoticeType),
            args: { weekNumber: { type: GraphQLInt } },
            description: 'Return notices of specific week',
            resolve(parent, args) {
                // code to get data from source
                var oo = rp(randomAddress() + "/getNotices")
                    .then(function (str) {
                        var json = JSON.parse(str)
                        return _.filter(json, { weekNumber: args.weekNumber });
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        console.log(err);
                        return err;
                    });
                return oo;
            }
        },
        monthNotices: {
            type: new GraphQLList(NoticeType),
            args: { month: { type: GraphQLInt } },
            description: 'Return notices of specific month',
            resolve(parent, args) {
                // code to get data from source
                var oo = rp(randomAddress() + "/getNotices")
                    .then(function (str) {
                        var json = JSON.parse(str)
                        return _.filter(json, { month: args.month });
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        console.log(err);
                        return err;
                    });
                return oo;
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addNotice: {
            type: NoticeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                topic: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                day: { type: new GraphQLNonNull(GraphQLInt) },
                weekNumber: { type: new GraphQLNonNull(GraphQLInt) },
                month: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                // code to send data to random server instance
                var options = {
                    method: 'POST',
                    uri: randomAddress()+"/addNotice",
                    body: {
                        id: args.id,
                        topic: args.topic,
                        description: args.description,
                        day: args.day,
                        weekNumber: args.weekNumber,
                        month: args.month
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                 
                var oo = rp(options)
                    .then(function (parsedBody) {
                        //var json = JSON.parse(parsedBody)
                        return parsedBody
                    })
                    .catch(function (err) {
                        console.log("post failed yo")
                        console.log(err)
                    });
                return oo;
            }
        },
        updateNotice: {
            type: NoticeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                topic: { type: GraphQLString },
                description: { type: GraphQLString },
                day: { type: GraphQLInt },
                weekNumber: { type: GraphQLInt },
                month: { type: GraphQLInt }
            },
            resolve(parent, args) {
                // code to send data to random server instance
                var options = {
                    method: 'POST',
                    uri: randomAddress()+"/updateNotice",
                    body: {
                        id: args.id,
                        topic: args.topic,
                        description: args.description,
                        day: args.day,
                        weekNumber: args.weekNumber,
                        month: args.month
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                 
                var oo = rp(options)
                    .then(function (parsedBody) {
                        //var json = JSON.parse(parsedBody)
                        return parsedBody
                    })
                    .catch(function (err) {
                        console.log("post failed yo")
                        console.log(err)
                    });
                return oo;
            }
        },
        deleteNotice: {
            type: NoticeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                // code to send data to random server instance
                var out = rp(randomAddress() + "/deleteNotice/" + args.id)
                    .then(function (str) {
                        //var json = JSON.parse(str)
                        // console.log(str)
                        return str;
                    })
                    .catch(function (err) {
                        // Crawling failed...
                        //console.log(err);
                        return err;
                    });
                return out
            }
        }
    }
});

function randomAddress() {
    return url + instance_port_pool[Math.floor(Math.random() * instance_port_pool.length)]
}

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});