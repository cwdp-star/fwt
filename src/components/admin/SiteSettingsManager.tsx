import { useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Building2, Mail, Share2 } from 'lucide-react';

const SiteSettingsManager = () => {
  const { settings, isLoading, updateSetting, getSettingsByCategory } = useSiteSettings();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = (id: string) => {
    if (editedValues[id] !== undefined) {
      updateSetting.mutate({ id, value: editedValues[id] });
      setEditedValues(prev => {
        const newValues = { ...prev };
        delete newValues[id];
        return newValues;
      });
    }
  };

  const renderSettingCard = (setting: any) => {
    const currentValue = editedValues[setting.id] ?? setting.value;
    const hasChanges = editedValues[setting.id] !== undefined;

    return (
      <div key={setting.id} className="space-y-2">
        <Label htmlFor={setting.key} className="text-sm font-semibold">
          {setting.label}
        </Label>
        {setting.description && (
          <p className="text-xs text-muted-foreground">{setting.description}</p>
        )}
        <div className="flex gap-2">
          <Input
            id={setting.key}
            value={currentValue}
            onChange={(e) => handleChange(setting.id, e.target.value)}
            placeholder={setting.label}
            className="flex-1"
          />
          {hasChanges && (
            <Button
              onClick={() => handleSave(setting.id)}
              size="sm"
              disabled={updateSetting.isPending}
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>A carregar configurações...</div>;
  }

  const companySettings = getSettingsByCategory('company');
  const contactSettings = getSettingsByCategory('contact');
  const socialSettings = getSettingsByCategory('social');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Configurações do Site
        </h2>
        <p className="text-muted-foreground">
          Gerir informações da empresa, contactos e redes sociais
        </p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Mail className="h-4 w-4 mr-2" />
            Contactos
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            Redes Sociais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Configure o nome e detalhes da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {companySettings.map(renderSettingCard)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contacto</CardTitle>
              <CardDescription>
                Telefone, email e morada da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactSettings.map(renderSettingCard)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                URLs das redes sociais da empresa (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialSettings.map(renderSettingCard)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsManager;
