using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace APIv2.Extensions
{
    public enum WKTType
    {
        Polygon,
        MultiPolygon
    }

    public class WKTPolygon
    {
        public List<WKTPoint> WKTPoints { get; set; } = new List<WKTPoint>();
    }

    public class WKTPoint
    {
        public double Lat { get; set; }
        public double Lng { get; set; }

        public WKTPoint(double lat, double lng)
        {
            Lat = lat;
            Lng = lng;
        }
    }

    public static class WKTConvert
    {
        public static WKTType GetWKTType(string WKT)
        {
            return WKT.ToLower().StartsWith("multipolygon") ? WKTType.MultiPolygon : WKTType.Polygon;
        }

        public static WKTPolygon[] GetPolygons(string WKT)
        {
            List<WKTPolygon> result = new List<WKTPolygon>();

            //Prep WKT for processing
            WKTType polyType = GetWKTType(WKT);
            if(polyType == WKTType.MultiPolygon)
            {
                WKT = WKT.Replace("MULTIPOLYGON(((", "((").Replace(")))", "))");
            }
            else
            {
                WKT = WKT.Replace("POLYGON", "");
            }

            bool hasPolygon = true;
            while (hasPolygon)
            {
                hasPolygon = false; //assume there are no polygons until confirmed

                //Find polygon start and end
                int startIndex = WKT.IndexOf("((");
                int endIndex = WKT.IndexOf("))") + 2;

                hasPolygon = (startIndex >= 0 && endIndex >= 0); //check for vaild polygon start & end
                if (hasPolygon)
                {
                    //extract polygon string
                    string polyStr = WKT.Substring(startIndex, endIndex - startIndex);
                    polyStr = polyStr.Replace("((", "").Replace("))", "");

                    //strip polygon from WKT
                    WKT = WKT.Substring(endIndex);

                    //Construct polygon and add WKTPoints
                    WKTPolygon polygon = new WKTPolygon();
                    polygon.WKTPoints.AddRange(GetPolygonPoints(polyStr));

                    if (polygon.WKTPoints.Count > 0)
                    {
                        result.Add(polygon); //add polygon to result if it has WKTPoints
                    }
                }
            }

            return result.ToArray();
        }

        private static WKTPoint[] GetPolygonPoints(string polygonWKT)
        {
            List<WKTPoint> result = new List<WKTPoint>();

            //Spilt polygon string into WKTPoints
            string[] strPoints = polygonWKT.Split(",");
            foreach (string p in strPoints)
            {
                //Extract WKTPoint X and Y
                string[] pointXY = p.Split(" ");
                if (pointXY.Length == 2)
                {
                    if (double.TryParse(pointXY[0], out double px) && double.TryParse(pointXY[1], out double py))
                    {
                        //Create WKTPoint
                        WKTPoint point = new WKTPoint(px, py);

                        //Add to result
                        result.Add(point);
                    }
                    else
                    {
                        //Throw exception to create awareness of data issue
                        throw new FormatException("Invalid WKTPoint coordinates - " + p);
                    }
                }
                else
                {
                    //Throw exception to create awareness of data issue
                    throw new FormatException("Invalid WKTPoint coordinates - " + p);
                }
            }

            return result.ToArray();
        }
    }
}
