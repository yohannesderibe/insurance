import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubcategoriesByCategory } from "../../../../api/Coustomer/Catagory/customerSubcategoryApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const CustomerSubcategories = () => {
  const { id } = useParams<{ id: string }>();
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getSubcategoriesByCategory(Number(id)).then(setSubcategories);
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-amber-800">Subcategories 🍯</h1>
          <Button
            onClick={() => navigate(-1)}
            sx={{
              textTransform: "none",
              color: "#92400E",
              border: "1px solid #92400E",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#FDE68A",
              },
            }}
          >
            ← Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subcategories.map((sub) => (
            <Card
              key={sub.id}
              className="!rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              sx={{
                background:
                  "linear-gradient(145deg, #FEF3C7 0%, #FCD34D 100%)",
                border: "1px solid #FBBF24",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="text-amber-800 font-semibold mb-1"
                >
                  {sub.name}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-amber-700 mb-2"
                >
                  {sub.description}
                </Typography>
                <Typography className="text-amber-900 font-medium mb-3">
                  Base Price: ${sub.basePrice}
                </Typography>

                <div className="border-t border-amber-200 pt-3">
                  <Typography
                    variant="subtitle2"
                    className="text-amber-700 mb-2 font-medium"
                  >
                    Coverage Options
                  </Typography>
                  {sub.coverages.map((c: any, index: number) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          sx={{
                            color: "#F59E0B",
                            "&.Mui-checked": { color: "#D97706" },
                          }}
                        />
                      }
                      label={`${c.name} (+$${c.extraCost})`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSubcategories;
