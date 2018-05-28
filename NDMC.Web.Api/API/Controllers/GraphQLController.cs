using API.Models;
using API.Resolvers;
using Database.Contexts;
using Database.Models;
using GraphQL.Net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


/* EXAMPLE QUERIES

    "{
        Projects {
            projectId
            projectTitle
            projectDescription
        }
    }"

    "{
        ProjectById(projectId: 741) {
            projectId
            projectTitle
            projectDescription
        }
    }"

    "{
        ProjectsFiltered(titlePart: \"wind\") {
            projectId
            projectTitle
            projectDescription
        }
    }"

 */


namespace API.Controllers
{
    public class GraphQLController : ApiController
    {
        private GraphQL<SQLDBContext> gql;

        public GraphQLController()
        {
            //Create relover logic instance
            var res = new GraphQLResolvers();

            //Create default schema
            var schema = GraphQL<SQLDBContext>.CreateDefaultSchema(() => new SQLDBContext());

            //Define schema fields
            schema.AddType<DeclaredEvent>().AddAllFields();
            schema.AddType<Department>().AddAllFields();
            schema.AddType<Event>().AddAllFields();
            schema.AddType<EventImpact>().AddAllFields();
            schema.AddType<EventRegion>().AddAllFields();
            schema.AddType<Mitigation>().AddAllFields();
            schema.AddType<Region>().AddAllFields();
            schema.AddType<RegionType>().AddAllFields();
            schema.AddType<TypeEvent>().AddAllFields();
            schema.AddType<TypeImpact>().AddAllFields();
            schema.AddType<TypeMitigation>().AddAllFields();
            schema.AddType<TypeSource>().AddAllFields();

            //Define schema queries
            schema.AddListField("Events", new { eventId = 0, startDate = 0, endDate = 0, eventType = 0, impactType = 0, region = 0, batchSize = 0, batchCount = 0 }, 
                (qc, args) => res.Events(qc, args.eventId, args.startDate, args.endDate, args.eventType, args.impactType, args.region, args.batchSize, args.batchCount));
            schema.AddListField("Regions", qc => res.Regions(qc));
            schema.AddListField("TypeEvents", qc => res.TypeEvents(qc));

            //Complete schema
            schema.Complete();

            //Get GraphQL instance
            gql = new GraphQL<SQLDBContext>(schema);
        }

        /// <summary>
        /// Support for a POST request
        /// </summary>
        /// <param name="request">The GraphQL request object</param>
        /// <returns>The execution result.</returns>
        [HttpPost]
        [Route("api/GraphQL/Request")]
        public new GraphQLResponse Request([FromBody]GraphQLRequest request)
        {
            // TODO: Try catch and handle errors by adding to response
            var data = gql.ExecuteQuery(request.query);

            return new GraphQLResponse()
            {
                Data = data
            };
        }
    }
}