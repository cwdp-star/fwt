import { useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Building2, Mail, Phone, MapPin, Share2, Globe } from 'lucide-react';

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

  const renderSettingField = (setting: any, icon?: React.ReactNode) => {
    const currentValue = editedValues[setting.id] ?? setting.value;
    const hasChanges = editedValues[setting.id] !== undefined;

    return (
      <div key={setting.id} className="space-y-1.5">
        <Label htmlFor={setting.key} className="text-sm font-medium flex items-center gap-2">
          {icon}
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const companySettings = getSettingsByCategory('company');
  const contactSettings = getSettingsByCategory('contact');
  const socialSettings = getSettingsByCategory('social');

  // Find specific settings for better organization
  const siteTitle = companySettings.find(s => s.key === 'site_title');
  const companyName = companySettings.find(s => s.key === 'company_name');
  const otherCompanySettings = companySettings.filter(s => !['site_title', 'company_name'].includes(s.key));

  const phone = contactSettings.find(s => s.key === 'company_phone');
  const email = contactSettings.find(s => s.key === 'company_email');
  const addressSettings = contactSettings.filter(s => s.key.includes('address'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Configurações do Site
        </h2>
        <p className="text-muted-foreground">
          Gerir todas as informações do website
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Site & Company Info */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-primary" />
              Site e Empresa
            </CardTitle>
            <CardDescription>
              Título do site e informações da empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {siteTitle && renderSettingField(siteTitle)}
            {companyName && renderSettingField(companyName, <Building2 className="h-4 w-4" />)}
            {otherCompanySettings.map(s => renderSettingField(s))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              Contactos
            </CardTitle>
            <CardDescription>
              Telefone, email e morada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {phone && renderSettingField(phone, <Phone className="h-4 w-4" />)}
            {email && renderSettingField(email, <Mail className="h-4 w-4" />)}
            
            <div className="pt-2 border-t">
              <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" />
                Morada
              </Label>
              <div className="space-y-3 pl-6">
                {addressSettings.map(s => renderSettingField(s))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-primary" />
              Redes Sociais
            </CardTitle>
            <CardDescription>
              URLs das redes sociais (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {socialSettings.map(s => renderSettingField(s))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
