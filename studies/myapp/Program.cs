using System;
using System.Collections.Generic;

namespace myapp
{
    internal class Program
    {
        public static decimal DimensionWeight(decimal dimensions)
        {
            decimal result = dimensions * 166;
            return result;
        }

        public static List<int[]> Count(int quantity, decimal dimensionWeight)
        {
            List<int[]> combinations = new List<int[]>();

            for (int x = 10; x <= 200; x++)
            {
                for (int y = x; y <= 200; y++)
                {
                    for (int z = y; z <= 200; z++)
                    {
                        decimal dw = x * y * z * quantity / 6000m;

                        if (dimensionWeight > dw && dimensionWeight - dw > 0 && dimensionWeight - dw < 1)
                        {
                            combinations.Add(new int[] { x, y, z });
                        }
                    }
                }
            }

            return SortList(combinations);
        }

        public static List<int[]> SortList(List<int[]> list)
        {
            list.Sort((x, y) => Math.Abs(x[0] - x[1]) + Math.Abs(x[0] - x[2]) + Math.Abs(x[1] - x[2]) -
                                Math.Abs(y[0] - y[1]) - Math.Abs(y[0] - y[2]) - Math.Abs(y[1] - y[2]));
            return list;
        }

        static void Main(string[] args)
        {
            bool continueInput = true;

            while (continueInput)
            {
                decimal dimensions = 0;
                int quantity = 0;
                bool validQuantity = false;
                bool validDimensions = false;

                while (!validQuantity)
                {
                    Console.WriteLine("Please input the Quantity: ");
                    string quantityInput = Console.ReadLine();

                    if (int.TryParse(quantityInput, out quantity))
                    {
                        validQuantity = true;
                    }
                    else
                    {
                        Console.WriteLine("Invalid input for Quantity. Please try again.");
                    }
                }

                while (!validDimensions)
                {
                    Console.WriteLine("Please input the Dimension: ");
                    string dimensionsInput = Console.ReadLine();

                    if (decimal.TryParse(dimensionsInput, out dimensions))
                    {
                        validDimensions = true;
                    }
                    else
                    {
                        Console.WriteLine("Invalid input for Dimension. Please try again.");
                    }
                }

                decimal dimensionWeight = DimensionWeight(dimensions);

                foreach (int[] arr in Count(quantity, dimensionWeight))
                {
                    string output = string.Join(", ", arr);
                    Console.WriteLine(output);
                }

                Console.Write("Do you want to continue? (Press Enter for yes):");

                // 使用 Console.ReadKey() 接收按键输入
                ConsoleKeyInfo keyInfo = Console.ReadKey();
                Console.WriteLine();

                string answer = keyInfo.Key == ConsoleKey.Enter ? "yes" : keyInfo.KeyChar.ToString().ToLowerInvariant();

                if (answer != "yes")
                {
                    continueInput = false;
                }
            }
        }
    }
}
