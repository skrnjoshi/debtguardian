import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Save, Settings, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  salary?: number;
  basicExpenseHousing?: number;
  basicExpenseFood?: number;
  basicExpenseTransport?: number;
  basicExpenseHealthcare?: number;
  basicExpenseOther?: number;
}

interface UserProfileSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
  onProfileUpdated?: () => void; // Callback to refresh analytics data
}

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    salary: 0,
    basicExpenseHousing: 0,
    basicExpenseFood: 0,
    basicExpenseTransport: 0,
    basicExpenseHealthcare: 0,
    basicExpenseOther: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load current user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setProfile({
            salary: parseFloat(userData.salary) || 0,
            basicExpenseHousing: parseFloat(userData.basicExpenseHousing) || 0,
            basicExpenseFood: parseFloat(userData.basicExpenseFood) || 0,
            basicExpenseTransport:
              parseFloat(userData.basicExpenseTransport) || 0,
            basicExpenseHealthcare:
              parseFloat(userData.basicExpenseHealthcare) || 0,
            basicExpenseOther: parseFloat(userData.basicExpenseOther) || 0,
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [toast]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value) || 0;
    setProfile((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }

      const requestBody = {
        salary: profile.salary,
        basicExpenses: {
          housing: profile.basicExpenseHousing,
          food: profile.basicExpenseFood,
          transport: profile.basicExpenseTransport,
          healthcare: profile.basicExpenseHealthcare,
          other: profile.basicExpenseOther,
        },
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your financial profile has been updated successfully",
        });

        // Call the callback to refresh analytics data
        if (onProfileUpdated) {
          onProfileUpdated();
        }

        if (onClose) onClose();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    const housing = profile.basicExpenseHousing || 0;
    const food = profile.basicExpenseFood || 0;
    const transport = profile.basicExpenseTransport || 0;
    const healthcare = profile.basicExpenseHealthcare || 0;
    const other = profile.basicExpenseOther || 0;

    const total = housing + food + transport + healthcare + other;
    return isNaN(total) ? 0 : total;
  };

  const formatCurrency = (amount: number) => {
    const validAmount =
      isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(validAmount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">
                  Financial Profile Settings
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Customize your basic expense categories to get more accurate
              financial insights
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Salary Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold">Monthly Salary</h3>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary (₹)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={profile.salary || ""}
                      onChange={(e) =>
                        handleInputChange("salary", e.target.value)
                      }
                      placeholder="Enter your monthly salary"
                      className="text-lg"
                    />
                  </div>
                </div>

                <Separator />

                {/* Basic Expenses Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Monthly Basic Expenses</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your monthly basic expense amounts. These will be used
                    to calculate your available income after essential needs.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="housing">Housing & Utilities (₹)</Label>
                      <Input
                        id="housing"
                        type="number"
                        value={profile.basicExpenseHousing || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "basicExpenseHousing",
                            e.target.value
                          )
                        }
                        placeholder="Rent, mortgage, utilities"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="food">Food & Groceries (₹)</Label>
                      <Input
                        id="food"
                        type="number"
                        value={profile.basicExpenseFood || ""}
                        onChange={(e) =>
                          handleInputChange("basicExpenseFood", e.target.value)
                        }
                        placeholder="Groceries, dining"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transport">Transportation (₹)</Label>
                      <Input
                        id="transport"
                        type="number"
                        value={profile.basicExpenseTransport || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "basicExpenseTransport",
                            e.target.value
                          )
                        }
                        placeholder="Fuel, public transport"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="healthcare">Healthcare (₹)</Label>
                      <Input
                        id="healthcare"
                        type="number"
                        value={profile.basicExpenseHealthcare || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "basicExpenseHealthcare",
                            e.target.value
                          )
                        }
                        placeholder="Medical, insurance"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="other">Other Essentials (₹)</Label>
                      <Input
                        id="other"
                        type="number"
                        value={profile.basicExpenseOther || ""}
                        onChange={(e) =>
                          handleInputChange("basicExpenseOther", e.target.value)
                        }
                        placeholder="Phone, internet, other necessities"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Summary Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Monthly Financial Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Salary</p>
                      <p className="font-semibold text-green-700">
                        {formatCurrency(profile.salary || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Basic Expenses</p>
                      <p className="font-semibold text-red-600">
                        {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-blue-200">
                      <p className="text-muted-foreground">
                        Available for EMIs & Discretionary
                      </p>
                      <p className="font-bold text-lg text-blue-700">
                        {formatCurrency(
                          (profile.salary || 0) - calculateTotal()
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button variant="outline" onClick={onClose} disabled={saving}>
                    Cancel
                  </Button>
                </div>

                <Alert>
                  <AlertDescription>
                    💡 <strong>Tip:</strong> Keep your expense amounts realistic
                    for more accurate financial health calculations. You can
                    update these anytime as your situation changes.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileSettings;
